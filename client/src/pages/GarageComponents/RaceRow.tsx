import styled from '@emotion/styled';
import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { CarType } from '@/helpers/types';
import Car from '@/pages/GarageComponents/Car';
import RaceRowSelUpd from '@/pages/GarageComponents/RaceRowSelUpd';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Cars/cars.slice';
import {
  getSpeedOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
} from '@/store/Slices/Cars/cars.thunk';

function RaceRow({ id, name, color }: CarType) {
  const startRace = useAppSelector((state) => state.garage.startRace);
  const winnerRace = useAppSelector((state) => state.garage.winnerRace);
  const resetPosition = useAppSelector((state) => state.garage.resetPosition);
  const carsRaceState = useAppSelector((state) => state.garage.carsRaceState[id]);
  const time = useAppSelector((state) => state.garage.carsRaceState[id]?.time);
  const status = useAppSelector((state) => state.garage.carsRaceState[id]?.status);

  const dispatch = useAppDispatch();

  const abortRef = React.useRef<AbortController>(new AbortController());

  // Старт гонки для всех. startRace меняется при получение promise.all времени анимации
  useEffect(() => {
    if (startRace) raceAllStart();
    if (!startRace && carsRaceState) stopCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRace, resetPosition]);

  // ОТМЕНА АНИМАЦИИ ПРИ ПОЛОМКЕ. Отменяем если эта машинка активна и не едет. Статусы в редаксе проставляются.
  // useEffect(() => {
  //   if (carsRaceState && carsRaceState.time) timers.current = carsRaceState.time;
  //   if (carsRaceState && (carsRaceState.isBroken || !carsRaceState.isDrive)) {
  //     carAnimation.current?.stop();
  //   }
  //   // if (!carsRaceState) setStartClick(false);
  // }, [carsRaceState]);

  // создаем контроллера для отмены fetch абортом
  const setBtnsAndAbort = async () => {
    // dispatch(garageActions.updCarsEmpty(false));
    abortRef.current = new AbortController();
  };

  const animationAndSetWin = async (time: number) => {
    dispatch(setDriveModeOneCar({ id, signal: abortRef.current.signal }))
      .unwrap()
      .then((isFiniched) => {
        if (isFiniched === 'success') dispatch(garageActions.setWinner({ id, name, color, time }));
      })
      .catch(() => {});
  };

  const handlerStart = async () => {
    setBtnsAndAbort();
    dispatch(getSpeedOneCar({ id }))
      .unwrap()
      .then(({ time }) => {
        animationAndSetWin(time);
      });
  };

  const stopCar = async () => {
    abortRef.current.abort();
    dispatch(setStopModeOneCar({ id }));
  };

  // Когда гонка для всех (отличается от одиночного старта способом получения time).
  const raceAllStart = async () => {
    setBtnsAndAbort();
    // animationAndSetWin(timers.current);
  };

  return (
    <RowContainer>
      <ButtonsBox>
        <RaceRowSelUpd id={id} color={color} name={name} />
        <Button bg="#fed7aa" size="sm" onClick={handlerStart} disabled={!!status}>
          start
        </Button>
        <Button bg="#fed7aa" size="sm" onClick={stopCar} disabled={!status}>
          stop
        </Button>
      </ButtonsBox>
      <Row colorFlag={winnerRace?.id === id ? '#bef264' : '#ef4444'}>
        <Car status={status} color={color} animationTime={time * 1000} />
      </Row>
    </RowContainer>
  );
}

const ButtonsBox = styled.div`
  display: grid;
  justify-items: stretch;
  grid-template-columns: 70px 70px 1fr 70px 70px;
  gap: 5px;
`;

const RowContainer = styled.div`
  border-bottom: 2px solid #eee;
  position: relative;
`;

const Row = styled.div<{ colorFlag?: string }>`
  &::after {
    content: '';
    display: block;
    position: absolute;

    height: 50%;
    width: 20px;
    background-color: ${(props) => props.colorFlag || 'red'};

    clip-path: polygon(85% 0, 100% 0%, 100% 100%, 85% 100%, 85% 40%, 0% 20%);

    right: 71px;
    bottom: 0%;
  }
`;

export default RaceRow;
