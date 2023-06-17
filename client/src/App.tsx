import styled from '@emotion/styled';
import clsx from 'clsx';
import { useState } from 'react';

import Header from '@/pages/components/Header';
import GaragePage from '@/pages/GaragePage';
import WinnersPage from '@/pages/WinnersPage';

const App = () => {
  const [isGaragePage, setIsGarage] = useState(true);

  const handleChangePage = (isOpen: boolean) => {
    setIsGarage(isOpen);
  };

  return (
    <Wrapper>
      <Header handleChangePage={handleChangePage} />
      <Main>
        <div className={clsx({ hide: !isGaragePage })}>
          <GaragePage />
        </div>
        <div className={clsx({ hide: isGaragePage })}>
          <WinnersPage />
        </div>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px 30px;
  transition: all 0.2s;

  @media (max-width: 550px) {
    padding: 20px 15px;
  }
`;

const Main = styled.main`
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

export default App;
