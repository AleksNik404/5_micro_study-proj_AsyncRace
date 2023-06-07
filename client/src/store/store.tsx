import { configureStore } from '@reduxjs/toolkit';

import { garageReducer } from '@/store/Slices/Garage/GarageSlice';
import { winnersReducer } from '@/store/Slices/Winners/WinnersSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
  },
});
