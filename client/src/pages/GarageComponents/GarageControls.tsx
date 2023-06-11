import styled from '@emotion/styled';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import CreateCar from '@/pages/GarageComponents/CreateCar';
import UpdateCar from '@/pages/GarageComponents/UpdateCar';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Cars/cars.slice';
import { createManyCars, fetchPageCars, getDurationCars } from '@/store/Slices/Cars/cars.thunk';

const GarageControls = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector((state) => state.garage.cars);
  const someCarIsActive = useAppSelector(
    (state) => Object.keys(state.garage.activeCarsState).length > 0
  );

  const handlerResetRace = useCallback(() => {
    dispatch(garageActions.resetRace());
  }, [dispatch]);

  const handlerStartRace = async () => {
    await dispatch(getDurationCars(cars));
    dispatch(garageActions.setStatusRace('run race'));
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
        <Button bg="#fed7aa" onClick={handlerStartRace} disabled={someCarIsActive}>
          Race
        </Button>
        <Button bg="#fed7aa" onClick={handlerResetRace} disabled={!someCarIsActive}>
          Reset
        </Button>
        <Button bg="#fed7aa" onClick={() => handlerCreateManyCars(100)} disabled={someCarIsActive}>
          Generate Cars
        </Button>
      </RaceBtns>
    </ControlsGrid>
  );
};

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
