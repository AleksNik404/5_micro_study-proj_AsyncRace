export interface IWinnersPage {
  winners: WinnerType[];
  winnersPage: number;
  limit: number;
  totalWinners: number;

  sort: string;
  order: string;
}

export type WinnerType = {
  id: number;
  wins: number;
  time: number;
};
