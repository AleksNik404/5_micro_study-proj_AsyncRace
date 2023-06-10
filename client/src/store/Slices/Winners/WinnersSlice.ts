import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WinnerType } from '@/helpers/types';
import { fetchPageWinners } from '@/store/Slices/Winners/WinnersThunk';

export interface IWinnersPage {
  winners: WinnerType[];
  winnersPage: number;
  limit: number;
  totalWinners: number;

  sort: string;
  order: string;
}

const initialState: IWinnersPage = {
  winners: [],
  winnersPage: 1,
  limit: 10,
  totalWinners: 4,

  sort: 'id',
  order: 'ASC',
};

export const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    increaseWinPage(state) {
      const maxPage = Math.ceil(state.totalWinners / state.limit);
      if (state.winnersPage < maxPage) state.winnersPage += 1;
    },
    decreaseWinPage(state) {
      if (state.winnersPage > 1) state.winnersPage -= 1;
    },
    updateTotalWinners(state, action: PayloadAction<number>) {
      state.totalWinners = action.payload;
    },
    changeSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    changeOrder(state, action: PayloadAction<string>) {
      state.order = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPageWinners.fulfilled, (state, action) => {
      state.winners = action.payload;
    });
  },
});

export const { reducer: winnersReducer, actions: winnersActions } = winnersSlice;
