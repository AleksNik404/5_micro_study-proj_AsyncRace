import axios from 'axios';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { CarType, URL_SERVER } from '@/helpers/types';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Cars/cars.slice';
import { deleteCar, fetchPageCars } from '@/store/Slices/Cars/cars.thunk';
import { fetchPageWinners } from '@/store/Slices/Winners/winners.thunk';
import { WinnerType } from '@/store/Slices/Winners/winners.types';

function RaceRowSelUpd({ id, name, color }: CarType) {
  const carIsActive = useAppSelector((state) => Boolean(state.garage.activeCarsState[id]?.status));
  const dispatch = useAppDispatch();

  const deleteWinner = async ({ id }: Pick<WinnerType, 'id'>) => {
    await axios.delete(`${URL_SERVER}/winners/${id}`);
  };

  const handlerUpdateCar = () => {
    dispatch(garageActions.setCloseUpdField(false));
    dispatch(garageActions.setUpdatingCar({ id, name, color }));
  };

  const handlerDeleteCar = async () => {
    await dispatch(deleteCar({ id }));
    await deleteWinner({ id });

    await dispatch(fetchPageWinners());
    await dispatch(fetchPageCars());
  };

  return (
    <>
      <Button disabled={carIsActive} bg="#c4b5fd" size="sm" onClick={handlerUpdateCar}>
        select
      </Button>
      <Button disabled={carIsActive} bg="#c4b5fd" size="sm" onClick={handlerDeleteCar}>
        remove
      </Button>
      <p>{name}</p>
    </>
  );
}

export default RaceRowSelUpd;
