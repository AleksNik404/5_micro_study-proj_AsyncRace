import styled from '@emotion/styled';

import { useAppSelector } from '@/helpers/hooks';

// TODO improve Modal
const WinnerRaceModal = () => {
  const raceWinner = useAppSelector((store) => store.carsActivity.raceWinner);

  return (
    <Modal>
      {raceWinner?.name} wins the race ({raceWinner?.time}s)
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  left: 50%;
  top: 15%;

  font-size: 30px;
  padding: 10px 20px;

  transform: translate(-50%, -50%);
`;

export default WinnerRaceModal;
