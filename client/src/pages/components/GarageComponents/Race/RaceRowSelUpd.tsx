import { FC } from 'react';

import { customAxios } from '@/helpers/axios';
import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { Button } from '@/pages/components/Header';
import { garageActions } from '@/store/Slices/CarsPage/cars.slice';
import { deleteCar, fetchPageCars } from '@/store/Slices/CarsPage/cars.thunk';
import { CarType } from '@/store/Slices/CarsPage/cars.types';
import { fetchPageWinners } from '@/store/Slices/WinnersPage/winners.thunk';
import { WinnerType } from '@/store/Slices/WinnersPage/winners.types';

const RaceRowSelUpd: FC<CarType> = ({ id, name, color }) => {
  const carIsActive = useAppSelector((state) => !!state.carsActivity.activeCarsState[id]?.status);
  const raceStatus = useAppSelector((state) => state.carsActivity.raceStatus);

  const dispatch = useAppDispatch();

  const deleteWinner = async ({ id }: Pick<WinnerType, 'id'>) => {
    customAxios.delete(`/winners/${id}`).catch(() => {});
  };

  const handlerUpdateCar = () => {
    dispatch(garageActions.setCloseUpdField(false));
    dispatch(garageActions.setUpdatingCar({ id, name, color }));
  };

  const handlerDeleteCar = async () => {
    await dispatch(deleteCar({ id }));
    await deleteWinner({ id });

    dispatch(fetchPageWinners());
    dispatch(fetchPageCars());
  };

  return (
    <>
      <Button
        disabled={carIsActive || raceStatus !== 'initial'}
        bg="#c4b5fd"
        size="sm"
        onClick={handlerUpdateCar}
      >
        select
      </Button>
      <Button
        disabled={carIsActive || raceStatus !== 'initial'}
        bg="#c4b5fd"
        size="sm"
        onClick={handlerDeleteCar}
      >
        remove
      </Button>
      <p>{name}</p>
    </>
  );
};

export default RaceRowSelUpd;
