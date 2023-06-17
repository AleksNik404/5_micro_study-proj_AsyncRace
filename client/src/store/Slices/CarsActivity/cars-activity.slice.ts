import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getDurationCars,
  getDurationOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
} from '@/store/Slices/CarsActivity/cars-activity.thunk';
import { CarsActivityStore, CarState } from '@/store/Slices/CarsActivity/cars-activity.types';

const initialState: CarsActivityStore = {
  raceStatus: 'initial',
  raceWinner: null,

  activeCarsState: {},
};

export const carsSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    resetRace(state) {
      state.raceStatus = 'reset';
      state.raceWinner = null;
    },

    resetRaceWinner(state) {
      state.raceWinner = null;
    },

    setStatusRace(state, action: PayloadAction<'initial' | 'run race' | 'disable' | 'reset'>) {
      state.raceStatus = action.payload;
    },

    setCarState(state, { payload }: PayloadAction<Omit<CarState, 'time'> & { id: number }>) {
      const { id, status, name } = payload;
      state.activeCarsState[id] = { status, name, time: 0 };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDurationCars.fulfilled, (state, action) => {
      state.activeCarsState = action.payload;
    });

    builder.addCase(getDurationOneCar.fulfilled, (state, action) => {
      const { id, time } = action.payload;
      state.activeCarsState[id].time = time;
    });

    builder.addCase(setDriveModeOneCar.pending, (state, action) => {
      state.activeCarsState[action.meta.arg.id].status = 'run';
    });

    builder.addCase(setDriveModeOneCar.fulfilled, (state, action) => {
      state.activeCarsState[action.meta.arg.id].status = 'stopped';
      const id = action.payload;
      const { time, name } = state.activeCarsState[id];

      if (!state.raceWinner && state.raceStatus == 'run race') {
        state.raceWinner = { id, time, name };
      }
    });

    builder.addCase(setDriveModeOneCar.rejected, (state, action) => {
      state.activeCarsState[action.meta.arg.id].status = 'stopped';

      if (action.payload?.includes('broken')) {
        state.activeCarsState[action.meta.arg.id].status = 'broken';
      }
    });

    builder.addCase(setStopModeOneCar.pending, (state, action) => {
      state.activeCarsState[action.meta.arg.id].status = 'stopped';
    });

    builder.addCase(setStopModeOneCar.fulfilled, (state, action) => {
      delete state.activeCarsState[action.meta.arg.id];
    });
  },
});

export const { reducer: carsActivityReducer, actions: carsActivityActions } = carsSlice;
