import { FC } from 'react';

import { customAxios } from '@/helpers/fetchAPI';
import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { CarType } from '@/helpers/types';
import { Button } from '@/pages/components/Header';
import { garageActions } from '@/store/Slices/Cars/cars.slice';
import { deleteCar, fetchPageCars } from '@/store/Slices/Cars/cars.thunk';
import { fetchPageWinners } from '@/store/Slices/Winners/winners.thunk';
import { WinnerType } from '@/store/Slices/Winners/winners.types';

const RaceRowSelUpd: FC<CarType> = ({ id, name, color }) => {
  const carIsActive = useAppSelector((state) => Boolean(state.garage.activeCarsState[id]?.status));
  const raceStatus = useAppSelector((state) => state.garage.raceStatus);

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
