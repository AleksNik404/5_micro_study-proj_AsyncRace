import { URL_SERVER, WinnerType } from '@/helpers/types';

// eslint-disable-next-line consistent-return
export const getWinnerByID = async (id: number) => {
  try {
    const response = await fetch(`${URL_SERVER}/winners/${id}`);
    return response.json();
  } catch (error) {
    // throw new Error(`Something was wrong. Get winner, ${error}`);
  }
};

export const createWinner = async ({ id, wins, time }: WinnerType) => {
  try {
    await fetch(`${URL_SERVER}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, wins, time }),
    });
  } catch (error) {
    // throw new Error(`Something was wrong. Create winner, ${error}`);
  }
};

export const updateWinner = async ({ id, wins, time }: WinnerType) => {
  try {
    await fetch(`${URL_SERVER}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wins, time }),
    });
  } catch (error) {
    // throw new Error(`Something was wrong. Update winner, ${error}`);
  }
};

// eslint-disable-next-line consistent-return
export const getCar = async ({ id }: { id: number }) => {
  try {
    const response = await fetch(`${URL_SERVER}/garage/${id}`);
    return response.json();
  } catch (error) {
    // throw new Error(`Something was wrong. Update winner, ${error}`);
  }
};
