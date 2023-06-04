import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import CreateCar from './CreateCar';
import UpdateCar from './UpdateCar';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { BTN_DISABLED, BTN_ENABLED } from '../../utils/types';
import { Button } from '../Header';
import { resetRace, setStartRace, updCarsEmpty } from '../../store/Slices/GarageSlice';
import { getDurationCars, createManyCars, fetchPageCars } from '../../store/Slices/GarageThunk';

function GarageControls() {
  const dispatch = useAppDispatch();
  const { cars, isCarsActiveEmpty } = useAppSelector((state) => state.garage);

  const [startBtn, setStartBtn] = useState<boolean>(BTN_ENABLED);
  const [resetBtn, setResetBtn] = useState<boolean>(BTN_DISABLED);

  // NOTE: Сброс гонки, изминение state и на это отреагирует useEffect в каждой машинке.
  const handlerResetRace = useCallback(() => {
    setResetBtn(BTN_DISABLED);
    dispatch(resetRace());
  }, [dispatch]);

  // NOTE: Блокирование кнопок.
  useEffect(() => {
    setStartBtn(!isCarsActiveEmpty);

    if (!isCarsActiveEmpty) setResetBtn(BTN_ENABLED);
    if (isCarsActiveEmpty) handlerResetRace(); // Мб лишнее уже, не убираю.
  }, [handlerResetRace, isCarsActiveEmpty]);

  // NOTE: Одновременный старт гонки для всех машинок, promise.all получение время анимации и useEffect старт.
  const handlerStartRace = async () => {
    dispatch(updCarsEmpty(false));
    setStartBtn(BTN_DISABLED);
    setResetBtn(BTN_ENABLED);

    await dispatch(getDurationCars(cars));
    dispatch(setStartRace(true));
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
