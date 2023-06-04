import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import RaceRow from './RaceRow';
import { decreasePage, increasePage } from '../../store/Slices/GarageSlice';
import { Button } from '../Header';
import { fetchPageCars } from '../../store/Slices/GarageThunk';

function GarageRace() {
  const { racePage, cars, totalCars, isCarsActiveEmpty } = useAppSelector((state) => state.garage);
  const dispatch = useAppDispatch();

  // NOTE: Запрос на машинки. При изминение страницы.
  useEffect(() => {
    dispatch(fetchPageCars());
  }, [dispatch, racePage]);

  return (
    <Main>
      <h2>Garage ({totalCars}) </h2>
      <PageBlock>
        <h3>Page #{racePage}</h3>
        <Button size="sm" disabled={!isCarsActiveEmpty} onClick={() => dispatch(decreasePage())}>
          Prev
        </Button>
        <Button size="sm" disabled={!isCarsActiveEmpty} onClick={() => dispatch(increasePage())}>
          Next
        </Button>
      </PageBlock>
      <RaceField>
        {cars.map(({ id, color, name }) => {
          return <RaceRow key={id} id={id} color={color} name={name} />;
        })}
      </RaceField>
    </Main>
  );
}

const Main = styled.main``;

export const PageBlock = styled.div`
  margin: 10px 0;
  display: grid;
  grid-template-columns: 75px 50px 50px;

  align-items: center;
  gap: 5px;
`;

const RaceField = styled.div`
  display: grid;
  gap: 10px;
`;

export default GarageRace;
