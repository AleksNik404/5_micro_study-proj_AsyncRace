import { createAsyncThunk } from '@reduxjs/toolkit';

import { customAxios } from '@/helpers/axios';
import { CarType } from '@/helpers/types';
import { getRandomNameCar, randomColor } from '@/helpers/utils';
import { garageActions } from '@/store/Slices/CarsPage/cars.slice';
import { AppDispatch, RootState } from '@/store/store.types';

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

export const createManyCars = createAsyncThunk<void, number, { dispatch: AppDispatch }>(
  'garage/createManyCars',
  async (count, Thunk) => {
    for (let i = 0; i < 100; i += 1) {
      Thunk.dispatch(createCar({ name: getRandomNameCar(), color: randomColor() }));
    }
  }
);

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

  // Todo в билдер убрать
  const totalCars = Number(response.headers['x-total-count']);
  Thunk.dispatch(garageActions.updateTotalCars(totalCars));

  return response.data;
});

export const garageThunks = {
  fetchPageCars,
  createCar,
  updateCar,
  deleteCar,

  createManyCars,
};
