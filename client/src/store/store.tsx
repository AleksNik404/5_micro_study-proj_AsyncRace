import { configureStore } from '@reduxjs/toolkit';

import { garageReducer } from '@/store/Slices/Cars/cars.slice';
import { winnersReducer } from '@/store/Slices/Winners/winners.slice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
  },
});
