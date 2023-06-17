import { customAxios } from '@/helpers/axios';
import { CarType } from '@/store/Slices/CarsPage/cars.types';
import { WinnerType } from '@/store/Slices/WinnersPage/winners.types';

export const getWinnerByID = async (id: CarType['id']) => {
  try {
    const { data } = await customAxios.get(`/winners/${id}`);
    return data;
  } catch (error) {
    // throw new Error(`Something was wrong. Get winner, ${error}`);
  }
};

export const createWinner = async (winner: WinnerType) => {
  try {
    await customAxios.post(`/winners`, winner);
  } catch (error) {
    // throw new Error(`Something was wrong. Create winner, ${error}`);
  }
};

export const updateWinner = async ({ id, wins, time }: WinnerType) => {
  try {
    await customAxios.put(`/winners/${id}`, { wins, time });
  } catch (error) {
    // throw new Error(`Something was wrong. Update winner, ${error}`);
  }
};

export const getCar = async ({ id }: { id: CarType['id'] }) => {
  try {
    const { data } = await customAxios.get(`/garage/${id}`);
    return data;
  } catch (error) {
    // throw new Error(`Something was wrong. Update winner, ${error}`);
  }
};
