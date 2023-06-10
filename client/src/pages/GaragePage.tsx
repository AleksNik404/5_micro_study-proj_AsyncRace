import styled from '@emotion/styled';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import GarageControls from '@/pages/GarageComponents/GarageControls';
import GarageRace from '@/pages/GarageComponents/GarageRace';
import WinnerRaceModal from '@/pages/GarageComponents/WinnerRaceModal';
import { garageActions } from '@/store/Slices/Cars/cars.slice';

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
