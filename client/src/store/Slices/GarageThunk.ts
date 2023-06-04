// TODO: Почему запросы редакса такие жирные, вынести в отдельный файл не получилось

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';

import { ICarsState, updateTotalCars } from './GarageSlice';
import { CarType, URL_SERVER } from '../../utils/types';
import { getRandomNameCar, randomColor } from '../../utils/utils';

// Получаем машинОК / обновляем total / возвращаю машинки в стейт
export const fetchPageCars = createAsyncThunk<
  CarType[],
  void,
  { rejectValue: string; state: RootState; dispatch: AppDispatch }
>('garage/fetchCars', async function fetchPageCarsThunk(_, Thunk) {
  const { racePage, limit } = Thunk.getState().garage;
  const response = await fetch(`${URL_SERVER}/garage?_page=${racePage}&_limit=${limit}`);

  if (!response.ok) {
    return Thunk.rejectWithValue('Server fetch error');
  }

  const totalCars = Number(response.headers.get('X-Total-Count'));
  Thunk.dispatch(updateTotalCars(totalCars));

  return response.json();
});

export const createCar = createAsyncThunk<void, Pick<CarType, 'name' | 'color'>>(
  'garage/createCar',
  async (car) => {
    await fetch(`${URL_SERVER}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  }
);

export const updateCar = createAsyncThunk<void, CarType>(
  'garage/updateCar',
  async ({ id, color, name }) => {
    await fetch(`${URL_SERVER}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
  }
);

export const deleteCar = createAsyncThunk<void, Pick<CarType, 'id'>>(
  'garage/deleteCar',
  async ({ id }) => {
    await fetch(`${URL_SERVER}/garage/${id}`, {
      method: 'DELETE',
    });
  }
);

export const getDurationCars = createAsyncThunk<ICarsState, CarType[]>(
  'garage/getDurationCars',
  async (cars) => {
    const requests = cars.map((car) =>
      fetch(`http://127.0.0.1:3000/engine?id=${car.id}&status=started`, {
        method: 'PATCH',
      })
    );

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map((res) => res.json()));

    const carsState: ICarsState = data.reduce((acc, car, index) => {
      const time = Number((car.distance / car.velocity / 1000).toFixed(2));
      const { id } = cars[index];

      const carState = { time, isDrive: false, isBroken: false };

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
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, {
    method: 'PATCH',
  });

  if (!response.ok) return Thunk.rejectWithValue('ERROR FETCH SPEED ONE CAR');

  const { velocity, distance } = await response.json();
  const time = Number((distance / velocity / 1000).toFixed(2));

  return { id, time };
});

export const setDriveModeOneCar = createAsyncThunk<
  string,
  { id: number; signal: AbortSignal },
  { rejectValue: string }
>('garage/setDriveModeOneCar', async ({ id, signal }, Thunk) => {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
    method: 'PATCH',
    signal,
  });
  if (!response.ok) return Thunk.rejectWithValue('Engine was broken down');

  return 'success';
});

export const setStopModeOneCar = createAsyncThunk<
  string,
  { id: number },
  { rejectValue: string | number }
>('garage/setStopModeOneCar', async ({ id }, Thunk) => {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  });
  if (!response.ok) return Thunk.rejectWithValue(response.statusText);
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
