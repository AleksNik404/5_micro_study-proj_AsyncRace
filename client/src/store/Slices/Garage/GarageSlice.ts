import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CarType } from '@/helpers/types';
import {
  fetchPageCars,
  getDurationCars,
  getSpeedOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
} from '@/store/Slices/Garage/GarageThunk';

export interface ICarsState {
  [key: number]: { isDrive: boolean; isBroken: boolean; time: number };
}

export interface IGarage {
  cars: CarType[];

  racePage: number;
  limit: number;
  totalCars: number;

  isCarsActiveEmpty: boolean;
  isDisabledUpdField: boolean;
  updatingCar: null | CarType;

  startRace: boolean | null;
  resetPosition: boolean;
  winnerRace: null | (CarType & { time: number });

  carsRaceState: ICarsState;
}

const initialState: IGarage = {
  cars: [],

  racePage: 1,
  limit: 7,
  totalCars: 4,

  isCarsActiveEmpty: true,
  isDisabledUpdField: true,
  updatingCar: null,

  startRace: null,
  resetPosition: true,
  winnerRace: null,

  carsRaceState: {},
};

export const garageSlice = createSlice({
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

    setWinner(state, action: PayloadAction<(CarType & { time: number }) | null>) {
      if (state.winnerRace || !state.startRace) return;

      state.winnerRace = action.payload;
    },

    setStartRace(state, action: PayloadAction<boolean>) {
      state.startRace = action.payload;
    },

    resetRace(state) {
      state.startRace = false;
      state.winnerRace = null;
      state.resetPosition = !state.resetPosition;
    },

    updCarsEmpty(state, action: PayloadAction<boolean>) {
      state.isCarsActiveEmpty = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPageCars.fulfilled, (state, action) => {
      state.cars = action.payload;
    });
    builder.addCase(getDurationCars.fulfilled, (state, action) => {
      state.carsRaceState = action.payload;
    });

    builder.addCase(getSpeedOneCar.fulfilled, (state, action) => {
      const { id, time } = action.payload;
      state.carsRaceState[id] = {
        isBroken: false,
        isDrive: false,
        time,
      };
    });

    builder.addCase(setDriveModeOneCar.pending, (state, action) => {
      state.carsRaceState[action.meta.arg.id].isDrive = true;
    });
    builder.addCase(setDriveModeOneCar.fulfilled, (state, action) => {
      state.carsRaceState[action.meta.arg.id].isDrive = false;
    });
    builder.addCase(setDriveModeOneCar.rejected, (state, action) => {
      state.carsRaceState[action.meta.arg.id].isDrive = false;

      if (action.payload?.includes('broken')) {
        state.carsRaceState[action.meta.arg.id].isBroken = true;
      }
    });

    builder.addCase(setStopModeOneCar.pending, (state, action) => {
      state.carsRaceState[action.meta.arg.id].isDrive = false;
    });
    builder.addCase(setStopModeOneCar.fulfilled, (state, action) => {
      state.carsRaceState[action.meta.arg.id].isBroken = false;
      delete state.carsRaceState[action.meta.arg.id];
    });
  },
});

export const { reducer: garageReducer, actions: garageActions } = garageSlice;
