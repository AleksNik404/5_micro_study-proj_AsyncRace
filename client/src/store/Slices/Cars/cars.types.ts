import { CarType } from '@/helpers/types';

export interface CarState {
  status: string;
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

  isCarsActiveEmpty: boolean;
  isDisabledUpdField: boolean;
  updatingCar: null | CarType;

  raceStatus: 'initial' | 'run race' | 'reset';
  // startRace: boolean | null;
  // resetPosition: boolean;
  winnerRace: null | WinnerCar;

  carsRaceState: CarsState;
}

export interface WinnerCar {
  id: number;
  name: string;
  time: number;
}
