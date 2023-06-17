import { configureStore } from '@reduxjs/toolkit';

import { carsActivityReducer } from '@/store/Slices/CarsActivity/cars-activity.slice';
import { garageReducer } from '@/store/Slices/CarsPage/cars.slice';
import { winnersReducer } from '@/store/Slices/WinnersPage/winners.slice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
    carsActivity: carsActivityReducer,
  },
});
