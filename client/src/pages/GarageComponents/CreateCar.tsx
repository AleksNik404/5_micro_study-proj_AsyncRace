import styled from '@emotion/styled';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import { getRandomNameCar } from '@/helpers/utils';
import { Button } from '@/pages/Header';
import { createCar, fetchPageCars } from '@/store/Slices/Cars/cars.thunk';

const CreateCar = () => {
  const raceStatus = useAppSelector((state) => state.garage.raceStatus);

  const [carName, setCarName] = useState('');
  const [carColor, setCarColor] = useState('#ffffff');

  const dispatch = useAppDispatch();

  const handlerCreateCar = async () => {
    const name = carName || getRandomNameCar();
    await dispatch(createCar({ name, color: carColor }));
    await dispatch(fetchPageCars());

    setCarName('');
    setCarColor('#ffffff');
  };

  return (
    <ControlsBox>
      <input onChange={(e) => setCarName(e.target.value)} value={carName} type="text" />
      <input onChange={(e) => setCarColor(e.target.value)} value={carColor} type="color" />
      <Button bg="#c4b5fd" onClick={handlerCreateCar} disabled={raceStatus !== 'initial'}>
        create
      </Button>
    </ControlsBox>
  );
};

export const ControlsBox = styled.article`
  display: grid;
  grid-template-columns: 2.7fr max-content 1fr;
  gap: 4px;

  & > * {
    border-radius: 0;
    border: 0;
  }
`;

export default CreateCar;
