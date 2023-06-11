import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { CarType, URL_SERVER } from '@/helpers/types';
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
  const response = await axios.get(`${URL_SERVER}/garage`, { params });

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
    await axios.post(`${URL_SERVER}/garage`, car);
  }
);

export const updateCar = createAsyncThunk<void, CarType>(
  'garage/updateCar',
  async ({ id, color, name }) => {
    await axios.put(`${URL_SERVER}/garage/${id}`, { name, color });
  }
);

export const deleteCar = createAsyncThunk<void, Pick<CarType, 'id'>>(
  'garage/deleteCar',
  async ({ id }) => {
    await axios.delete(`${URL_SERVER}/garage/${id}`);
  }
);

export const getDurationCars = createAsyncThunk<CarsState, CarType[]>(
  'garage/getDurationCars',
  async (cars) => {
    const requests = cars.map((car) =>
      axios.patch(`${URL_SERVER}/engine?id=${car.id}&status=started`)
    );

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

export const getSpeedOneCar = createAsyncThunk<
  { id: number; time: number },
  { id: number },
  { rejectValue: string }
>('garage/getSpeedOneCar', async ({ id }, Thunk) => {
  const response = await axios.patch(`${URL_SERVER}/engine?id=${id}&status=started`);

  if (response.status !== 200) {
    console.warn('axios error getSpeedOneCar');
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

  return await axios
    .patch(`${URL_SERVER}/engine`, null, {
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
  const response = await axios.patch(`${URL_SERVER}/engine`, null, { params });

  if (response.status !== 200) {
    console.warn('axios error setStopModeOneCar');
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
