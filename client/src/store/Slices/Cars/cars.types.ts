import { CarType } from '@/helpers/types';

export interface ICarsState {
  [key: number]: { status: string; time: number };
}

export interface IGarage {
  cars: CarType[];

  racePage: number;
  limit: number;
  totalCars: number;

  isCarsActiveEmpty: boolean;
  isDisabledUpdField: boolean;
  updatingCar: null | CarType;

  startRace: boolean | null;
  resetPosition: boolean;
  winnerRace: null | (CarType & { time: number });

  carsRaceState: ICarsState;
}
