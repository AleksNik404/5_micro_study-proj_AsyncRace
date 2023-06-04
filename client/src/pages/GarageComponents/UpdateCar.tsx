import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { setCloseUpdField, setUpdatingCar } from '../../store/Slices/GarageSlice';

import { Button } from '../Header';
import { ControlsBox } from './CreateCar';
import { fetchPageCars, updateCar } from '../../store/Slices/GarageThunk';
import { fetchPageWinners } from '../../store/Slices/WinnersThunk';

function UpdateCar() {
  const { isDisabledUpdField, updatingCar } = useAppSelector((state) => state.garage);

  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#ffffff');

  useEffect(() => {
    setName(updatingCar?.name || '');
    setColor(updatingCar?.color || '#ffffff');
  }, [updatingCar]);

  const dispatch = useAppDispatch();

  const handlerUpdateCarBtn = async () => {
    dispatch(setCloseUpdField(true));

    if (!updatingCar) return;
    await dispatch(updateCar({ color, name, id: updatingCar.id }));
    await dispatch(fetchPageWinners());
    await dispatch(fetchPageCars());
    dispatch(setUpdatingCar(null));
  };

  return (
    <ControlsBox>
      <input
        disabled={isDisabledUpdField}
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
      />
      <input
        disabled={isDisabledUpdField}
        onChange={(e) => setColor(e.target.value)}
        value={color}
        type="color"
      />
      <Button bg="#c4b5fd" onClick={handlerUpdateCarBtn} disabled={isDisabledUpdField}>
        update
      </Button>
    </ControlsBox>
  );
}

export default UpdateCar;
