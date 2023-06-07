import { createAsyncThunk } from '@reduxjs/toolkit';
import { URL_SERVER, WinnerType } from '../../utils/types';
import { AppDispatch } from '../store';
import { IWinnersPage, winnersActions } from './WinnersSlice';

export const fetchPageWinners = createAsyncThunk<
  WinnerType[],
  void,
  { rejectValue: string; state: { winners: IWinnersPage }; dispatch: AppDispatch }
>('winners/fetchPageWinners', async (_, Thunk) => {
  const { winnersPage, limit, sort, order } = Thunk.getState().winners;
  const response = await fetch(
    `${URL_SERVER}/winners?_page=${winnersPage}&_limit=${limit}&_sort=${sort}&_order=${order}`
  );

  if (!response.ok) {
    return Thunk.rejectWithValue('Server fetch error');
  }

  const totalWinners = Number(response.headers.get('X-Total-Count'));

  Thunk.dispatch(winnersActions.updateTotalWinners(totalWinners));

  return response.json();
});
