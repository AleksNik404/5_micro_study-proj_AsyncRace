import React, { useState } from 'react';
import styled from '@emotion/styled';
import Header from './pages/Header';
import GaragePage from './pages/GaragePage';
import WinnersPage from './pages/WinnersPage';

function App() {
  const [isGaragePage, setIsGarage] = useState(true);

  const handleChangePage = (isOpen: boolean) => {
    setIsGarage(isOpen);
  };

  return (
    <Wrapper>
      <Header handleChangePage={handleChangePage} />
      <Main>
        <div className={`${isGaragePage ? '' : 'hide'}`}>
          <GaragePage />
        </div>
        <div className={`${isGaragePage ? 'hide' : ''}`}>
          <WinnersPage />
        </div>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.main`
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
