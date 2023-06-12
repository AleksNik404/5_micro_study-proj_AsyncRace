import axios from 'axios';

import { CarType, URL_SERVER } from '@/helpers/types';
import { WinnerType } from '@/store/Slices/Winners/winners.types';

export const customAxios = axios.create({
  baseURL: URL_SERVER,
});

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
