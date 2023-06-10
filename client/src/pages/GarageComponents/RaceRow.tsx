import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';

import SvgCar from '@/assets/SvgCar';
import { Animate } from '@/helpers/animation';
import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { CarType } from '@/helpers/types';
import RaceRowSelUpd from '@/pages/GarageComponents/RaceRowSelUpd';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Garage/garage.slice';
import {
  getSpeedOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
} from '@/store/Slices/Garage/garage.thunk';

function RaceRow({ id, name, color }: CarType) {
  const startRace = useAppSelector((state) => state.garage.startRace);
  const winnerRace = useAppSelector((state) => state.garage.winnerRace);
  const resetPosition = useAppSelector((state) => state.garage.resetPosition);
  const carsRaceState = useAppSelector((state) => state.garage.carsRaceState[id]);

  const carAnimation = React.useRef<Animate>();

  useEffect(() => {
    carAnimation.current = new Animate(carRef);

    return () => {
      carAnimation.current?.stop();
      carAnimation.current = undefined;
    };
  }, []);

  ///////

  const dispatch = useAppDispatch();

  // const [startClick, setStartClick] = useState(false);
  // const [stopClick, setStopClick] = useState(true);

  const carRef = React.useRef<HTMLDivElement>(null);

  const abortRef = React.useRef<AbortController>(new AbortController());
  const timers = React.useRef<number>(0);

  // Старт гонки для всех. startRace меняется при получение promise.all времени анимации
  useEffect(() => {
    if (startRace) raceAllStart();
    if (!startRace && carsRaceState) stopCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRace, resetPosition]);

  // ОТМЕНА АНИМАЦИИ ПРИ ПОЛОМКЕ. Отменяем если эта машинка активна и не едет. Статусы в редаксе проставляются.
  useEffect(() => {
    if (carsRaceState && carsRaceState.time) timers.current = carsRaceState.time;
    if (carsRaceState && (carsRaceState.isBroken || !carsRaceState.isDrive)) {
      carAnimation.current?.stop();
    }
    // if (!carsRaceState) setStartClick(false);
  }, [carsRaceState]);

  // Переключаем кнопки (чтоб нельзя 2 раза нажать) и создаем контроллера для отмены fetch абортом
  const setBtnsAndAbort = async () => {
    dispatch(garageActions.updCarsEmpty(false));
    // setStartClick(true);
    // setStopClick(false);
    abortRef.current = new AbortController();
  };

  const animationAndSetWin = async (time: number) => {
    carAnimation.current?.start(time * 1000);

    dispatch(setDriveModeOneCar({ id, signal: abortRef.current.signal }))
      .unwrap()
      .then((isFiniched) => {
        if (isFiniched === 'success') dispatch(garageActions.setWinner({ id, name, color, time }));
      })
      .catch((error) => {});
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
    // setStopClick(true);
    abortRef.current.abort();
    carAnimation.current?.stop();
    await dispatch(setStopModeOneCar({ id }));
    carAnimation.current?.reset();
  };

  // Когда гонка для всех (отличается от одиночного старта способом получения time).
  const raceAllStart = async () => {
    setBtnsAndAbort();
    animationAndSetWin(timers.current);
  };

  return (
    <RowContainer>
      <ButtonsBox>
        <RaceRowSelUpd id={id} color={color} name={name} />
        <Button
          bg="#fed7aa"
          size="sm"
          onClick={handlerStart}
          // disabled={startClick}
        >
          start
        </Button>
        <Button
          bg="#fed7aa"
          size="sm"
          onClick={stopCar}
          // disabled={stopClick}
        >
          stop
        </Button>
      </ButtonsBox>
      <Row colorFlag={winnerRace?.id === id ? '#bef264' : '#ef4444'}>
        <SvgBox className={`${carsRaceState?.isBroken && 'broken'}`} ref={carRef}>
          <SvgCar fill={color} width="70px" height="50px" />
        </SvgBox>
      </Row>
    </RowContainer>
  );
}

const SvgBox = styled.div`
  width: min-content;
  position: relative;
  overflow: hidden;
  bottom: -18px;

  position: relative;

  &.broken::after,
  &.broken::before {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background-color: red;

    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
  }
  &.broken::after {
    transform: translate(-50%, -50%) rotate(35deg);
  }
  &.broken::before {
    transform: translate(-50%, -50%) rotate(-35deg);
  }
`;

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
