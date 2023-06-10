import axios from 'axios';

import { CarType, URL_SERVER, WinnerType } from '@/helpers/types';

// eslint-disable-next-line consistent-return
export const getWinnerByID = async (id: CarType['id']) => {
  try {
    const { data } = await axios.get(`${URL_SERVER}/winners/${id}`);
    return data;
  } catch (error) {
    // throw new Error(`Something was wrong. Get winner, ${error}`);
  }
};

export const createWinner = async (winner: WinnerType) => {
  try {
    await axios.post(`${URL_SERVER}/winners`, winner);
  } catch (error) {
    // throw new Error(`Something was wrong. Create winner, ${error}`);
  }
};

export const updateWinner = async ({ id, wins, time }: WinnerType) => {
  try {
    await axios.put(`${URL_SERVER}/winners/${id}`, { wins, time });
  } catch (error) {
    // throw new Error(`Something was wrong. Update winner, ${error}`);
  }
};

export const getCar = async ({ id }: { id: CarType['id'] }) => {
  try {
    const { data } = await axios.get(`${URL_SERVER}/garage/${id}`);
    return data;
  } catch (error) {
    // throw new Error(`Something was wrong. Update winner, ${error}`);
  }
};
