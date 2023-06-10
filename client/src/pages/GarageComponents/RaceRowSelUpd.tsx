import axios from 'axios';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { CarType, URL_SERVER, WinnerType } from '@/helpers/types';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Garage/GarageSlice';
import { deleteCar, fetchPageCars } from '@/store/Slices/Garage/GarageThunk';
import { fetchPageWinners } from '@/store/Slices/Winners/WinnersThunk';

function RaceRowSelUpd({ id, name, color }: CarType) {
  const { isCarsActiveEmpty } = useAppSelector((state) => state.garage);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line no-shadow
  const deleteWinner = async ({ id }: Pick<WinnerType, 'id'>) => {
    await axios.delete(`${URL_SERVER}/winners/${id}`);
  };

  // NOTE: Кнопка селект, отправляем текущие данные в стейт, которые возьмет форма для отображения
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
      <Button bg="#c4b5fd" size="sm" onClick={handlerUpdateCar}>
        select
      </Button>
      <Button disabled={!isCarsActiveEmpty} bg="#c4b5fd" size="sm" onClick={handlerDeleteCar}>
        remove
      </Button>
      <p>{name}</p>
    </>
  );
}

export default RaceRowSelUpd;
