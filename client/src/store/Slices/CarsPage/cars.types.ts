import { CarType } from '@/helpers/types';

export interface IGarage {
  cars: CarType[];

  racePage: number;
  limit: number;
  totalCars: number;

  isDisabledUpdField: boolean;
  updatingCar: null | CarType;
}
