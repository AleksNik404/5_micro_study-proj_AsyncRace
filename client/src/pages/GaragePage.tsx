import styled from '@emotion/styled';

import { useAppSelector } from '@/helpers/hooks';
import GarageControls from '@/pages/GarageComponents/GarageControls';
import GarageRace from '@/pages/GarageComponents/GarageRace';
import WinnerRaceModal from '@/pages/GarageComponents/WinnerRaceModal';

const GaragePage = () => {
  const { raceWinner } = useAppSelector((state) => state.garage);

  return (
    <Container>
      {raceWinner && <WinnerRaceModal />}
      <GarageControls />
      <GarageRace />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
`;

export default GaragePage;
