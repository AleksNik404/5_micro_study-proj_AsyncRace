import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchPageCars } from '@/store/Slices/CarsPage/cars.thunk';
import { CarType } from '@/store/Slices/CarsPage/cars.types';
import { IGarage } from '@/store/Slices/CarsPage/cars.types';

const initialState: IGarage = {
  cars: [],

  racePage: 1,
  limit: 7,
  totalCars: 4,

  isDisabledUpdField: true,
  updatingCar: null,
};

export const carsSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    increasePage(state) {
      const maxPage = Math.ceil(state.totalCars / state.limit);
      if (state.racePage < maxPage) state.racePage += 1;
    },
    decreasePage(state) {
      if (state.racePage > 1) state.racePage -= 1;
    },

    updateTotalCars(state, action: PayloadAction<number>) {
      state.totalCars = action.payload;
    },

    setCloseUpdField(state, action: PayloadAction<boolean>) {
      state.isDisabledUpdField = action.payload;
    },

    setUpdatingCar(state, action: PayloadAction<CarType | null>) {
      state.updatingCar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPageCars.fulfilled, (state, action) => {
      state.cars = action.payload;
    });
  },
});

export const { reducer: garageReducer, actions: garageActions } = carsSlice;
