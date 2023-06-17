export type CarType = { name: string; color: string; id: number };

export interface IGarage {
  cars: CarType[];

  racePage: number;
  limit: number;
  totalCars: number;

  isDisabledUpdField: boolean;
  updatingCar: null | CarType;
}
