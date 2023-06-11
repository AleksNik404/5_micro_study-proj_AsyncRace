import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CarType } from '@/helpers/types';
import {
  fetchPageCars,
  getDurationCars,
  getSpeedOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
} from '@/store/Slices/Cars/cars.thunk';
import { CarsState, CarState, IGarage } from '@/store/Slices/Cars/cars.types';

const initialState: IGarage = {
  cars: [],

  racePage: 1,
  limit: 7,
  totalCars: 4,

  isCarsActiveEmpty: true,
  isDisabledUpdField: true,
  updatingCar: null,

  raceStatus: 'initial',
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

    setStartRace(state, action: PayloadAction<'initial' | 'run race'>) {
      state.raceStatus = action.payload;
    },

    resetRace(state) {
      state.raceStatus = 'initial';
      state.winnerRace = null;
    },

    updCarsEmpty(state, action: PayloadAction<boolean>) {
      state.isCarsActiveEmpty = action.payload;
    },

    setStatus(state, { payload }: PayloadAction<Omit<CarState, 'time'> & { id: number }>) {
      const { id, status, name } = payload;
      state.carsRaceState[id] = { status, name, time: 0 };
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
      state.carsRaceState[id].time = time;
    });

    builder.addCase(setDriveModeOneCar.pending, (state, action) => {
      state.carsRaceState[action.meta.arg.id].status = 'run';
    });
    builder.addCase(setDriveModeOneCar.fulfilled, (state, action) => {
      state.carsRaceState[action.meta.arg.id].status = 'stopped';
      const id = action.payload;
      const { time, name } = state.carsRaceState[id];

      if (!state.winnerRace && state.raceStatus == 'run race') {
        state.winnerRace = { id, time, name };
      }
    });
    builder.addCase(setDriveModeOneCar.rejected, (state, action) => {
      state.carsRaceState[action.meta.arg.id].status = 'stopped';

      if (action.payload?.includes('broken')) {
        state.carsRaceState[action.meta.arg.id].status = 'broken';
      }
    });

    builder.addCase(setStopModeOneCar.pending, (state, action) => {
      state.carsRaceState[action.meta.arg.id].status = 'stopped';
    });
    builder.addCase(setStopModeOneCar.fulfilled, (state, action) => {
      delete state.carsRaceState[action.meta.arg.id];
    });
  },
});

export const { reducer: garageReducer, actions: garageActions } = garageSlice;
