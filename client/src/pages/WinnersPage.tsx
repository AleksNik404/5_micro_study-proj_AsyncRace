import styled from '@emotion/styled';
import React, { useCallback, useEffect } from 'react';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import RowWinner from './WinnersComponents/RowWinner';
import { Button } from './Header';
import { PageBlock } from './GarageComponents/GarageRace';
import { createWinner, getWinnerByID, updateWinner } from '../utils/fetchAPI';
import { winnersActions } from '../store/Slices/WinnersSlice';
import { fetchPageWinners } from '../store/Slices/WinnersThunk';

function WinnersPage() {
  const dispatch = useAppDispatch();
  const { winnerRace } = useAppSelector((state) => state.garage);
  const { totalWinners, winners, winnersPage, sort, order } = useAppSelector(
    (state) => state.winners
  );

  // Победителя создаем или обновляем
  const updateWinnerData = useCallback(async () => {
    if (!winnerRace) return;

    const winner = await getWinnerByID(winnerRace.id);

    if (winner) {
      const time = Math.min(winner.time, winnerRace.time);
      await updateWinner({ id: winner.id, wins: winner.wins + 1, time });
    }
    await createWinner({ id: winnerRace.id, wins: 1, time: winnerRace.time });

    dispatch(fetchPageWinners());
  }, [dispatch, winnerRace]);

  useEffect(() => {
    dispatch(fetchPageWinners());
  }, [sort, order, winnersPage, dispatch]);

  useEffect(() => {
    updateWinnerData();
  }, [updateWinnerData, winnerRace]);

  const handlerSortWins = () => {
    dispatch(winnersActions.changeSort('wins'));
    dispatch(winnersActions.changeOrder(order === 'ASC' ? 'DESC' : 'ASC'));
  };

  const handlerSortTime = () => {
    dispatch(winnersActions.changeSort('time'));
    dispatch(winnersActions.changeOrder(order === 'ASC' ? 'DESC' : 'ASC'));
  };

  return (
    <Container>
      <h2>Winners ({totalWinners})</h2>
      <PageBlock>
        <h3>Page #{winnersPage}</h3>
        <Button onClick={() => dispatch(winnersActions.decreaseWinPage())}>Prev</Button>
        <Button onClick={() => dispatch(winnersActions.increaseWinPage())}>Next</Button>
      </PageBlock>

      <Winners>
        <HeaderTable className="grid-table__row">
          <p>Number</p>
          <p>Car</p>
          <p>Name</p>

          <p onClick={handlerSortWins} className="sort-btn">
            Wins {sort === 'wins' && (order === 'ASC' ? <BsArrowDownShort /> : <BsArrowUpShort />)}
          </p>
          <p onClick={handlerSortTime} className="sort-btn">
            Best time (seconds){' '}
            {sort === 'time' && (order === 'ASC' ? <BsArrowDownShort /> : <BsArrowUpShort />)}
          </p>
        </HeaderTable>

        {winners.map((winner, index) => {
          return <RowWinner key={winner.id} winner={winner} index={index} />;
        })}
      </Winners>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;

  & .sort-btn {
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    flex-direction: row;
  }
`;

const Winners = styled.aside`
  width: 100%;

  & .grid-table__row {
    display: grid;
    grid-template-columns: 60px 70px 150px 50px 150px;
    justify-items: center;
    align-items: center;

    overflow: hidden;

    & > * {
      padding: 5px 0px;
    }

    @media (max-width: 550px) {
      font-size: 14px;

      grid-template-columns: 50px 70px 130px 40px 130px;
    }
  }
`;

const HeaderTable = styled.header``;

export default WinnersPage;
