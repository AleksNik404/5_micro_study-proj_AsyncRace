import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchPageWinners } from '@/store/Slices/Winners/winners.thunk';
import { IWinnersPage } from '@/store/Slices/Winners/winners.types';

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
