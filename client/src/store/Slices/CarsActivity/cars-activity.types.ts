import { WinnerCar } from '@/store/Slices/WinnersPage/winners.types';

export interface CarState {
  status: 'stopped' | 'starting' | 'run' | 'broken';
  time: number;
  name: string;
}

export interface CarsState {
  [key: number]: CarState;
}

export interface CarsActivityStore {
  raceStatus: 'initial' | 'disable' | 'run race' | 'reset';
  raceWinner: null | WinnerCar;

  activeCarsState: CarsState;
}
