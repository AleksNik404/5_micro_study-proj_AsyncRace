import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { BTN_DISABLED, BTN_ENABLED } from '@/helpers/types';
import CreateCar from '@/pages/GarageComponents/CreateCar';
import UpdateCar from '@/pages/GarageComponents/UpdateCar';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Garage/garage.slice';
import { createManyCars, fetchPageCars, getDurationCars } from '@/store/Slices/Garage/garage.thunk';

function GarageControls() {
  const dispatch = useAppDispatch();
  const { cars, isCarsActiveEmpty } = useAppSelector((state) => state.garage);

  const [startBtn, setStartBtn] = useState<boolean>(BTN_ENABLED);
  const [resetBtn, setResetBtn] = useState<boolean>(BTN_DISABLED);

  // NOTE: Сброс гонки, изминение state и на это отреагирует useEffect в каждой машинке.
  const handlerResetRace = useCallback(() => {
    setResetBtn(BTN_DISABLED);
    dispatch(garageActions.resetRace());
  }, [dispatch]);

  // NOTE: Блокирование кнопок.
  useEffect(() => {
    setStartBtn(!isCarsActiveEmpty);

    if (!isCarsActiveEmpty) setResetBtn(BTN_ENABLED);
    if (isCarsActiveEmpty) handlerResetRace(); // Мб лишнее уже, не убираю.
  }, [handlerResetRace, isCarsActiveEmpty]);

  // NOTE: Одновременный старт гонки для всех машинок, promise.all получение время анимации и useEffect старт.
  const handlerStartRace = async () => {
    dispatch(garageActions.updCarsEmpty(false));
    setStartBtn(BTN_DISABLED);
    setResetBtn(BTN_ENABLED);

    await dispatch(getDurationCars(cars));
    dispatch(garageActions.setStartRace(true));
  };

  const handlerCreateManyCars = async (countCars: number) => {
    await dispatch(createManyCars(countCars));
    dispatch(fetchPageCars());
  };

  return (
    <ControlsGrid>
      <CreateCar />
      <UpdateCar />
      <RaceBtns>
        <Button bg="#fed7aa" onClick={handlerStartRace} disabled={startBtn}>
          Race
        </Button>
        <Button bg="#fed7aa" onClick={handlerResetRace} disabled={resetBtn}>
          Reset
        </Button>
        <Button
          bg="#fed7aa"
          onClick={() => handlerCreateManyCars(100)}
          disabled={!isCarsActiveEmpty}
        >
          Generate Cars
        </Button>
      </RaceBtns>
    </ControlsGrid>
  );
}

const ControlsGrid = styled.article`
  display: flex;
  flex-direction: column;
  gap: 5px;

  max-width: 350px;
  margin-bottom: 30px;
`;

const RaceBtns = styled.article`
  padding-top: 15px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(3, 1fr);
`;

export default GarageControls;
