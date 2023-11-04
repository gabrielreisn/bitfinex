import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './rootReducer';

export const reduxStore = configureStore({
  reducer,
});
