import styled from '@emotion/styled';
import { FC, useCallback, useEffect, useState } from 'react';

import SvgCar from '@/assets/SvgCar';
import { useAppSelector } from '@/helpers/hooks';
import { CarType } from '@/store/Slices/CarsPage/cars.types';
import { getCar } from '@/store/Slices/WinnersPage/winners.fetch';
import { WinnerType } from '@/store/Slices/WinnersPage/winners.types';

interface IRowWinner {
  winner: WinnerType;
  index: number;
}

// TODO check the props
const RowWinner: FC<IRowWinner> = ({ winner: { id, wins, time }, index }) => {
  // TODO split
  const { winners, winnersPage, limit } = useAppSelector((state) => state.winners);
  const [car, setCar] = useState<CarType | null>(null);

  const setWinnerCar = useCallback(async () => {
    const carData = await getCar({ id });
    setCar(carData);
  }, [id]);

  useEffect(() => {
    setWinnerCar();
  }, [setWinnerCar, winners]);

  return (
    <div key={id} className="grid-table__row">
      <Text>{index + 1 + (winnersPage - 1) * limit}</Text>

      <SvgCar fill={car ? car.color : 'none'} height="20px" width="70px" />

      <Text>{car && car.name}</Text>
      <Text>{wins}</Text>
      <Text>{time}</Text>
    </div>
  );
};

const Text = styled.p``;

export default RowWinner;
