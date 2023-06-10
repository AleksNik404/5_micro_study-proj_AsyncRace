import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';

import SvgCar from '@/assets/SvgCar';
import { getCar } from '@/helpers/fetchAPI';
import { useAppSelector } from '@/helpers/hooks';
import { CarType } from '@/helpers/types';
import { WinnerType } from '@/store/Slices/Winners/winners.types';

interface IRowWinner {
  winner: WinnerType;
  index: number;
}

// NOTE: Строка для таблицы победителей
function RowWinner({ winner: { id, wins, time }, index }: IRowWinner) {
  const { winners, winnersPage, limit } = useAppSelector((state) => state.winners);
  const [car, setCar] = useState<CarType | null>(null);

  // Получение данных машинки для отображения SVG иконки.
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
}

const Text = styled.p``;

export default RowWinner;
