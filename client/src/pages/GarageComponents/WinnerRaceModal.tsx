import { useAppSelector } from '@/utils/hooks';
import styled from '@emotion/styled';

function WinnerRaceModal() {
  const { winnerRace } = useAppSelector((store) => store.garage);

  // Ленивое отображение победителя
  return (
    <Modal>
      {winnerRace?.name} wins the race ({winnerRace?.time}s)
    </Modal>
  );
}

const Modal = styled.div`
  position: fixed;
  left: 50%;
  top: 15%;

  font-size: 30px;
  padding: 10px 20px;

  transform: translate(-50%, -50%);
`;

export default WinnerRaceModal;
