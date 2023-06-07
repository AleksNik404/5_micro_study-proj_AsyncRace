import { garageActions } from '../../store/Slices/GarageSlice';
import { CarType, URL_SERVER, WinnerType } from '../../utils/types';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { Button } from '../Header';
import { fetchPageWinners } from '../../store/Slices/WinnersThunk';
import { deleteCar, fetchPageCars } from '../../store/Slices/GarageThunk';

function RaceRowSelUpd({ id, name, color }: CarType) {
  const { isCarsActiveEmpty } = useAppSelector((state) => state.garage);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line no-shadow
  const deleteWinner = async ({ id }: Pick<WinnerType, 'id'>) => {
    await fetch(`${URL_SERVER}/winners/${id}`, {
      method: 'DELETE',
    });
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
