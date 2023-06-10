import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import SvgCar from '@/assets/SvgCar';
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
  const { startRace, winnerRace, resetPosition } = useAppSelector((state) => state.garage);
  const dispatch = useAppDispatch();
  // Получение состояния конкретной машинки, или undefined
  const carsRaceState = useAppSelector((state) => state.garage.carsRaceState[id]);

  const [startClick, setStartClick] = useState(false);
  const [stopClick, setStopClick] = useState(true);

  // рефы для позиции / id анимации / отмены fetch
  const carRef = React.useRef<HTMLDivElement>(null);
  const requestIDRef = React.useRef<number>(null!);

  const controllerRef = React.useRef<AbortController>(new AbortController());
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
      cancelAnimationFrame(requestIDRef.current);
    }
    if (!carsRaceState) setStartClick(false);
  }, [carsRaceState]);

  // Переключаем кнопки (чтоб нельзя 2 раза нажать) и создаем контроллера для отмены fetch абортом
  const setBtnsAndAbort = async () => {
    dispatch(garageActions.updCarsEmpty(false));
    setStartClick(true);
    setStopClick(false);
    controllerRef.current = new AbortController();
  };

  /// 2 функции АНИМАЦИИ ДВИЖЕНИЯ через requestAnimationFrame. Сложно читаются.
  // eslint-disable-next-line no-unused-vars
  function startAnimation(duration: number, changePosition: (progress: number) => void) {
    let startAnim: number | null = null;

    requestIDRef.current = requestAnimationFrame(function measure(time) {
      if (!startAnim) startAnim = time;

      const progress = (time - startAnim) / duration;
      changePosition(progress);
      if (progress < 1) requestIDRef.current = requestAnimationFrame(measure);
    });
  }
  // callback в startAnimation на смену позиции
  const changePositionCar = (carHTML: React.RefObject<HTMLDivElement>, progress: number) => {
    if (!carHTML || !carHTML.current) return;
    // eslint-disable-next-line no-param-reassign
    carHTML.current.style.left = `Calc(${progress * 100}% - ${
      carHTML.current.clientWidth * progress
    }px)`;
  };

  // Стартуем анимацию и сопровождаем fetch на поломку / финиш
  const animationAndSetWin = async (time: number) => {
    try {
      startAnimation(Number(time * 1000), changePositionCar.bind(null, carRef));
      const isFiniched = await dispatch(
        setDriveModeOneCar({ id, signal: controllerRef.current.signal })
      ).unwrap();
      if (isFiniched === 'success') dispatch(garageActions.setWinner({ id, name, color, time }));
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  // Одиночный старт машинки
  const handlerStart = async () => {
    try {
      setBtnsAndAbort();
      await dispatch(getSpeedOneCar({ id })).unwrap();
      animationAndSetWin(timers.current);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  // Когда гонка для всех, вызывет useEffcet (отличается от одиночного старта способом получения time) Мб переделать потом, но как.
  const raceAllStart = async () => {
    setBtnsAndAbort();
    animationAndSetWin(timers.current);
  };

  // абортим fetch, и машинку в stopped режим. Сброс позиции
  const stopCar = async () => {
    setStopClick(true);
    controllerRef.current.abort();
    await dispatch(setStopModeOneCar({ id }));
    if (carRef.current) carRef.current.style.left = `0`;
  };

  return (
    <RowContainer>
      <ButtonsBox>
        <RaceRowSelUpd id={id} color={color} name={name} />
        {/* TODO: можно убрать в отдельный компонент, как кнопки выше */}
        <Button bg="#fed7aa" size="sm" onClick={handlerStart} disabled={startClick}>
          start
        </Button>
        <Button bg="#fed7aa" size="sm" onClick={stopCar} disabled={stopClick}>
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
