import styled from '@emotion/styled';

import { useAppSelector } from '@/helpers/hooks';
import GarageControls from '@/pages/components/GarageComponents/Form/GarageControls';
import GarageRace from '@/pages/components/GarageComponents/Pagination/GarageRace';
import WinnerRaceModal from '@/pages/components/GarageComponents/WinnerRaceModal';

const GaragePage = () => {
  const raceWinner = useAppSelector((state) => state.garage.raceWinner);

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
