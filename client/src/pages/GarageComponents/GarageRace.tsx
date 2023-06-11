import styled from '@emotion/styled';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/helpers/hooks';
import RaceRow from '@/pages/GarageComponents/RaceRow';
import { Button } from '@/pages/Header';
import { garageActions } from '@/store/Slices/Cars/cars.slice';
import { fetchPageCars } from '@/store/Slices/Cars/cars.thunk';

function GarageRace() {
  const { racePage, cars, totalCars } = useAppSelector((state) => state.garage);
  const someCarIsActive = useAppSelector(
    (state) => Object.keys(state.garage.activeCarsState).length > 0
  );

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
        <Button
          size="sm"
          disabled={someCarIsActive}
          onClick={() => dispatch(garageActions.decreasePage())}
        >
          Prev
        </Button>
        <Button
          size="sm"
          disabled={someCarIsActive}
          onClick={() => dispatch(garageActions.increasePage())}
        >
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
