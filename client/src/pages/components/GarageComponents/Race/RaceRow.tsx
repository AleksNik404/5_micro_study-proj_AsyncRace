import styled from '@emotion/styled';
import React, { FC, useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import Car from '@/pages/components/GarageComponents/Race/Car';
import RaceRowSelUpd from '@/pages/components/GarageComponents/Race/RaceRowSelUpd';
import { Button } from '@/pages/components/Header';
import { carsActivityActions } from '@/store/Slices/CarsActivity/cars-activity.slice';
import {
  getDurationOneCar,
  setDriveModeOneCar,
  setStopModeOneCar,
} from '@/store/Slices/CarsActivity/cars-activity.thunk';
import { CarType } from '@/store/Slices/CarsPage/cars.types';

// TODO split
const RaceRow: FC<CarType> = ({ id, name, color }) => {
  const raceStatus = useAppSelector((state) => state.carsActivity.raceStatus);
  const winnerRace = useAppSelector((state) => state.carsActivity.raceWinner);

  const time = useAppSelector((state) => state.carsActivity.activeCarsState[id]?.time);
  const status = useAppSelector((state) => state.carsActivity.activeCarsState[id]?.status);

  const dispatch = useAppDispatch();
  const abortRef = React.useRef<AbortController>(new AbortController());

  const driving = useCallback(() => {
    abortRef.current = new AbortController();
    dispatch(setDriveModeOneCar({ id, signal: abortRef.current.signal }));
  }, [dispatch, id]);

  const stopCar = useCallback(() => {
    abortRef.current.abort();
    dispatch(setStopModeOneCar({ id }));
  }, [dispatch, id]);

  const handlerStart = useCallback(async () => {
    dispatch(carsActivityActions.setCarState({ id, status: 'starting', name }));
    await dispatch(getDurationOneCar({ id }));
    driving();
  }, [dispatch, driving, id, name]);

  useEffect(() => {
    if (raceStatus === 'run race') driving();
    if (raceStatus === 'reset') stopCar();
  }, [raceStatus, driving, stopCar]);

  return (
    <RowContainer>
      <ButtonsBox>
        <RaceRowSelUpd id={id} color={color} name={name} />
        <Button
          bg="#fed7aa"
          size="sm"
          onClick={handlerStart}
          disabled={Boolean(status) || raceStatus !== 'initial'}
        >
          start
        </Button>
        <Button
          bg="#fed7aa"
          size="sm"
          onClick={stopCar}
          disabled={!status || status === 'starting'}
        >
          stop
        </Button>
      </ButtonsBox>
      <Row colorFlag={winnerRace?.id === id ? '#bef264' : '#ef4444'}>
        <Car status={status} color={color} animationTime={time * 1000} />
      </Row>
    </RowContainer>
  );
};

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
