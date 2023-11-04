import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

type BookRecord = {
  price: number;
  count: number;
  amount: number;
  total?: number;
};

type BookState = {
  data: Record<string, BookRecord[]>;
};

type Payload = {
  channelId: string;
  data: [string, [BookRecord['price'], BookRecord['count'], BookRecord['amount']]];
};

const initialState: BookState = {
  data: {},
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBookOrder: (state, action: PayloadAction<Payload>) => {
      const { data, channelId } = action.payload;
      const [channel, updates] = data;
      const [price, count, amount] = updates;

      const previousState = state.data[channelId];

      const total = previousState ? previousState.reduce((acc, value) => acc + value.amount, 0) : 0;

      state.data[channelId] = [...(state.data[channelId] || []), { price, count, amount, total }];
    },
  },
});

export const getBookDetails = (channelId: string) =>
  createSelector(
    (state) => state.book.data[channelId] || [], // Getting trade details for the specified channelId
    (tradeDetails) => tradeDetails
  );

export const { setBookOrder } = bookSlice.actions;
