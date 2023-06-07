import styled from '@emotion/styled';
import { useEffect } from 'react';
import { garageActions } from '../store/Slices/GarageSlice';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import GarageControls from './GarageComponents/GarageControls';
import GarageRace from './GarageComponents/GarageRace';
import WinnerRaceModal from './GarageComponents/WinnerRaceModal';

function GaragePage() {
  const { winnerRace, carsRaceState } = useAppSelector((state) => state.garage);
  const dispatch = useAppDispatch();

  // NOTE: Проверка состояние активных машинок, пустой ли.
  useEffect(() => {
    const isCarsActiveEmpty = Object.keys(carsRaceState).length === 0;

    dispatch(garageActions.updCarsEmpty(isCarsActiveEmpty));
  }, [carsRaceState, dispatch]);

  return (
    <Container>
      {winnerRace && <WinnerRaceModal />}
      <GarageControls />
      <GarageRace />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  width: 100%;
`;

export default GaragePage;
