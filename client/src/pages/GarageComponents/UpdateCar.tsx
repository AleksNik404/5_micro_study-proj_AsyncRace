import { ControlsBox } from '@/pages/GarageComponents/CreateCar';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Garage/GarageSlice';
import { updateCar, fetchPageCars } from '@/store/Slices/Garage/GarageThunk';
import { fetchPageWinners } from '@/store/Slices/Winners/WinnersThunk';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { useState, useEffect } from 'react';

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
    dispatch(garageActions.setCloseUpdField(true));

    if (!updatingCar) return;
    await dispatch(updateCar({ color, name, id: updatingCar.id }));
    await dispatch(fetchPageWinners());
    await dispatch(fetchPageCars());
    dispatch(garageActions.setUpdatingCar(null));
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
