import { createAsyncThunk } from '@reduxjs/toolkit';

import { customAxios } from '@/helpers/axios';
import { CarsState } from '@/store/Slices/CarsActivity/cars-activity.types';
import { CarType } from '@/store/Slices/CarsPage/cars.types';

export const getDurationCars = createAsyncThunk<CarsState, CarType[]>(
  'garage/getDurationCars',
  async (cars) => {
    const requests = cars.map((car) => customAxios.patch(`/engine?id=${car.id}&status=started`));

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map((res) => res.data));

    const carsState: CarsState = data.reduce((acc, car, index) => {
      const time = Number((car.distance / car.velocity / 1000).toFixed(2));
      const { id, name } = cars[index];

      const carState = { time, status: 'run', name };

      return { ...acc, [id]: carState };
    }, {});

    return carsState;
  }
);

export const getDurationOneCar = createAsyncThunk<
  { id: number; time: number },
  { id: number },
  { rejectValue: string }
>('garage/getDurationOneCar', async ({ id }, Thunk) => {
  const response = await customAxios.patch(`/engine?id=${id}&status=started`);

  if (response.status !== 200) {
    return Thunk.rejectWithValue('ERROR FETCH SPEED ONE CAR');
  }

  const { velocity, distance } = await response.data;
  const time = Number((distance / velocity / 1000).toFixed(2));

  return { id, time };
});

export const setDriveModeOneCar = createAsyncThunk<
  number,
  { id: number; signal: AbortSignal },
  { rejectValue: string }
>('garage/setDriveModeOneCar', async ({ id, signal }, Thunk) => {
  const params = { id, status: 'drive' };

  return await customAxios
    .patch(`/engine`, null, {
      params,
      signal,
    })
    .then(() => {
      return id;
    })
    .catch(({ message }) => {
      const rejectMessage = message !== 'canceled' ? 'Engine was broken down' : 'Car is stopped';
      return Thunk.rejectWithValue(rejectMessage);
    });
});

export const setStopModeOneCar = createAsyncThunk<
  string,
  { id: number },
  { rejectValue: string | number }
>('garage/setStopModeOneCar', async ({ id }, Thunk) => {
  const params = { id, status: 'stopped' };
  const response = await customAxios.patch(`/engine`, null, { params });

  if (response.status !== 200) {
    return Thunk.rejectWithValue(response.statusText);
  }

  return 'stopped';
});

export const garageThunks = {
  getDurationCars,
  getDurationOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
};
