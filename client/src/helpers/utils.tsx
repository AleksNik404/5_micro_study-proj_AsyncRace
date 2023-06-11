import { CARS_NAMES } from '@/data/CarsNames';

export const randomColor = () => {
  return '#' + `${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const getRandomNameCar = () => {
  const indexCarName = Math.trunc(CARS_NAMES.length * Math.random());
  return CARS_NAMES[indexCarName];
};
