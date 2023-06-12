import { CarType } from '@/helpers/types';

export interface CarState {
  status: 'stopped' | 'starting' | 'run' | 'broken';
  time: number;
  name: string;
}

export interface CarsState {
  [key: number]: CarState;
}

export interface IGarage {
  cars: CarType[];

  racePage: number;
  limit: number;
  totalCars: number;

  isDisabledUpdField: boolean;
  updatingCar: null | CarType;

  raceStatus: 'initial' | 'disable' | 'run race' | 'reset';
  raceWinner: null | WinnerCar;

  activeCarsState: CarsState;
}

export interface WinnerCar {
  id: number;
  name: string;
  time: number;
}
