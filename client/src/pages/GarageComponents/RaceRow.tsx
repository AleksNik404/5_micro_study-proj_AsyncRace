import styled from '@emotion/styled';
import React, { useCallback, useEffect } from 'react';

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
  const raceStatus = useAppSelector((state) => state.garage.raceStatus);
  const winnerRace = useAppSelector((state) => state.garage.winnerRace);

  const time = useAppSelector((state) => state.garage.carsRaceState[id]?.time);
  const status = useAppSelector((state) => state.garage.carsRaceState[id]?.status);

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
    dispatch(garageActions.setStatus({ id, status: 'starting', name }));
    await dispatch(getSpeedOneCar({ id }));
    driving();
  }, [dispatch, driving, id, name]);

  useEffect(() => {
    if (raceStatus === 'run race') driving();
    if (raceStatus === 'initial') stopCar();
  }, [raceStatus, driving, stopCar]);

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
