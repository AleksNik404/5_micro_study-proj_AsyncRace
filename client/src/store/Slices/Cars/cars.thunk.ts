import { createAsyncThunk } from '@reduxjs/toolkit';

import { customAxios } from '@/helpers/fetchAPI';
import { CarType } from '@/helpers/types';
import { getRandomNameCar, randomColor } from '@/helpers/utils';
import { garageActions } from '@/store/Slices/Cars/cars.slice';
import { CarsState } from '@/store/Slices/Cars/cars.types';
import { AppDispatch, RootState } from '@/store/store.types';

// Получаем машинОК / обновляем total / возвращаю машинки в стейт
export const fetchPageCars = createAsyncThunk<
  CarType[],
  void,
  { rejectValue: string; state: RootState; dispatch: AppDispatch }
>('garage/fetchCars', async function fetchPageCarsThunk(_, Thunk) {
  const { racePage, limit } = Thunk.getState().garage;

  const params = { _limit: limit, _page: racePage };
  const response = await customAxios.get(`/garage`, { params });

  if (!response.status) {
    return Thunk.rejectWithValue('Server fetch error');
  }

  const totalCars = Number(response.headers['x-total-count']);
  Thunk.dispatch(garageActions.updateTotalCars(totalCars));

  return response.data;
});

export const createCar = createAsyncThunk<void, Pick<CarType, 'name' | 'color'>>(
  'garage/createCar',
  async (car) => {
    await customAxios.post(`/garage`, car);
  }
);

export const updateCar = createAsyncThunk<void, CarType>(
  'garage/updateCar',
  async ({ id, color, name }) => {
    await customAxios.put(`/garage/${id}`, { name, color });
  }
);

export const deleteCar = createAsyncThunk<void, Pick<CarType, 'id'>>(
  'garage/deleteCar',
  async ({ id }) => {
    await customAxios.delete(`/garage/${id}`);
  }
);

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

export const createManyCars = createAsyncThunk<void, number, { dispatch: AppDispatch }>(
  'garage/createManyCars',
  async (count, Thunk) => {
    for (let i = 0; i < 100; i += 1) {
      Thunk.dispatch(createCar({ name: getRandomNameCar(), color: randomColor() }));
    }
  }
);

export const garageThunks = {
  fetchPageCars,
  createCar,
  updateCar,
  deleteCar,
  getDurationCars,
  getDurationOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
  createManyCars,
};
