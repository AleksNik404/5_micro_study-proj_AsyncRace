import styled from '@emotion/styled';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import CreateCar from '@/pages/components/GarageComponents/Form/CreateCar';
import UpdateCar from '@/pages/components/GarageComponents/Form/UpdateCar';
import { Button } from '@/pages/components/Header';
import { carsActivityActions } from '@/store/Slices/CarsActivity/cars-activity.slice';
import { getDurationCars } from '@/store/Slices/CarsActivity/cars-activity.thunk';
import { createManyCars, fetchPageCars } from '@/store/Slices/CarsPage/cars.thunk';

const GarageControls = () => {
  const cars = useAppSelector((state) => state.garage.cars);
  const raceStatus = useAppSelector((state) => state.carsActivity.raceStatus);

  const zeroActiveCars = useAppSelector(
    (state) => Object.keys(state.carsActivity.activeCarsState).length === 0
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (zeroActiveCars) {
      dispatch(carsActivityActions.setStatusRace('initial'));
      dispatch(carsActivityActions.resetRaceWinner());
    }
  }, [dispatch, zeroActiveCars]);

  const handlerResetRace = () => {
    dispatch(carsActivityActions.resetRace());
  };

  const handlerStartRace = async () => {
    dispatch(carsActivityActions.setStatusRace('disable'));
    await dispatch(getDurationCars(cars));
    dispatch(carsActivityActions.setStatusRace('run race'));
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
        <Button
          bg="#fed7aa"
          onClick={handlerStartRace}
          disabled={!zeroActiveCars || raceStatus !== 'initial'}
        >
          Race
        </Button>
        <Button
          bg="#fed7aa"
          onClick={handlerResetRace}
          disabled={zeroActiveCars && raceStatus !== 'run race'}
        >
          Reset
        </Button>
        <Button
          bg="#fed7aa"
          onClick={() => handlerCreateManyCars(100)}
          disabled={!zeroActiveCars || raceStatus !== 'initial'}
        >
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
