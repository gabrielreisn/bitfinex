'use client';
import { getBookDetails, setBookOrder } from '@/lib/redux/slices/bookSlice';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WS_URL = 'wss://api-pub.bitfinex.com/ws/2'; // Domain

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
  const webSocketRef = useRef(null);

  const dispatch = useDispatch();
  const count = useSelector(getBookDetails('tBTCUSD'));

  useEffect(() => {
    console.log('aaaaa', { count });
  }, [count]);

  useEffect(() => {
    const socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
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

    // WebSocket event listeners
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      socket.send(payloadString);
    };

    socket.onmessage = (event) => {
      // console.log('Received message:', { data: event.data });

      const parsedData = parseEventData(event.data);

      if (parsedData) {
        dispatch(setBookOrder({ channelId: 'tBTCUSD', data: parsedData }));
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup function: close the WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={console.log}>Send</button>
    </main>
  );
}
