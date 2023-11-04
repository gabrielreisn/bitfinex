'use client';
import { Table } from '@/Components/Table';
import { getBuyBookDetails, getSellBookDetails, setBookOrder } from '@/lib/redux/slices/bookSlice';

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WS_URL = 'wss://api-pub.bitfinex.com/ws/2';

const payload = {
  event: 'subscribe',
  channel: 'book',
  freq: 'F0',
  len: '100',
  // precision
  prec: 'P0',
  subId: 'book/tBTCUSD/P0',
  symbol: 'tBTCUSD',
};

const payloadString = JSON.stringify(payload);

function parseEventData(data: string) {
  if (data.includes('event')) {
    console.info('ignoring ws event');

    return;
  }

  const parsed = JSON.parse(data);

  const [_channelId, updates] = parsed;

  if (updates.length > 3) {
    // we ignore the batch for now
    return;
  }

  return parsed;
}

export default function Home() {
  const dispatch = useDispatch();
  const buyOperations = useSelector(getBuyBookDetails(payload.symbol)) as any;
  const sellOperations = useSelector(getSellBookDetails(payload.symbol)) as any;

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      socket.send(payloadString);
    };

    socket.onmessage = (event) => {
      const parsedData = parseEventData(event.data);

      if (parsedData) {
        dispatch(setBookOrder({ channelId: payload.symbol, data: parsedData.slice(-20) }));
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup function: close the WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, [dispatch]);

  return (
    <main className="flex min-h-screen items-center gap-10 p-24">
      <Table action="buy" data={buyOperations} />
      <Table action="sell" data={sellOperations} />
    </main>
  );
}
