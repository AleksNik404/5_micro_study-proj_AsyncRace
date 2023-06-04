// import { configureStore } from '@reduxjs/toolkit';
import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit';
import garageReducer from './Slices/GarageSlice';
import winnersReducer from './Slices/WinnersSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
