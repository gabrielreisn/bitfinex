import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

type BookRecord = {
  price: number;
  count: number;
  amount: number;
  operation?: 'buy' | 'sell';
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

function isBuyOrSellOperation(number: number | null | undefined) {
  if (number != null && number !== undefined && !isNaN(number)) {
    if (number > 0) return 'buy';

    return 'sell';
  }
}

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBookOrder: (state, action: PayloadAction<Payload>) => {
      const { data, channelId } = action.payload;
      const [channel, updates] = data;
      const [price, count, amount] = updates;

      const previousState = state.data[channelId];

      const total = previousState
        ? previousState.reduce((acc, value) => {
            return value.amount ? acc + value.amount : acc;
          }, 0)
        : 0;

      state.data[channelId] = [
        ...(state.data[channelId] || []),
        { price, count, amount, total, operation: isBuyOrSellOperation(amount) },
      ];
    },
  },
});

export const getBookDetails = (channelId: string) =>
  createSelector(
    (state) => state.book.data[channelId] || [],
    (bookDetails) => bookDetails
  );

export const getSellBookDetails = (channelId: string) =>
  createSelector(
    (state) => state.book.data[channelId] || [],
    (bookDetails: any) => bookDetails.filter((book: BookRecord) => book.operation === 'sell')
  );

export const getBuyBookDetails = (channelId: string) =>
  createSelector(
    (state) => state.book.data[channelId] || [],
    (bookDetails: any) => bookDetails.filter((book: BookRecord) => book.operation === 'buy')
  );

export const { setBookOrder } = bookSlice.actions;
