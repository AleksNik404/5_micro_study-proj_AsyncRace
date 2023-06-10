import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { URL_SERVER } from '@/helpers/types';
import { winnersActions } from '@/store/Slices/Winners/winners.slice';
import { IWinnersPage, WinnerType } from '@/store/Slices/Winners/winners.types';
import { AppDispatch } from '@/store/store.types';

export const fetchPageWinners = createAsyncThunk<
  WinnerType[],
  void,
  { rejectValue: string; state: { winners: IWinnersPage }; dispatch: AppDispatch }
>('winners/fetchPageWinners', async (_, Thunk) => {
  const { winnersPage, limit, sort, order } = Thunk.getState().winners;
  const params = {
    _page: winnersPage,
    _limit: limit,
    _sort: sort,
    _order: order,
  };
  const response = await axios(`${URL_SERVER}/winners`, { params });

  if (response.status !== 200) {
    console.warn('axios error fetchPageWinners');
    return Thunk.rejectWithValue('Server fetch error');
  }

  const totalWinners = Number(response.headers['x-total-count']);

  Thunk.dispatch(winnersActions.updateTotalWinners(totalWinners));

  return response.data;
});