// export const URL_SERVER = 'http://127.0.0.1:3000';
export const URL_SERVER = 'https://async-race-74ax.onrender.com';

export type CarType = { name: string; color: string; id: number };

export type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

export const BTN_DISABLED = true;
export const BTN_ENABLED = false;