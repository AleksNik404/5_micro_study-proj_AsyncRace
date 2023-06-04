import React from 'react';
import styled from '@emotion/styled';

interface HeaderProps {
  // eslint-disable-next-line no-unused-vars
  handleChangePage: (isOpen: boolean) => void;
}

function Header({ handleChangePage }: HeaderProps) {
  return (
    <Links>
      <Button bg="#f59e0b" onClick={() => handleChangePage(true)}>
        To Garage
      </Button>
      <Button bg="#93c5fd" onClick={() => handleChangePage(false)}>
        To Winners
      </Button>
    </Links>
  );
}

const Links = styled.nav`
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
`;

export const Button = styled.button<{ bg?: string; size?: string }>`
  border: none;

  background-color: ${(props) => {
    return props.disabled ? '#52525b' : props.bg;
  }};
  padding: ${(props) => {
    if (props.size === 'lg') return '10px 15px';
    if (props.size === 'sm') return '2px 4px';
    return '5px 10px';
  }};

  cursor: pointer;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(110%);
  }
  &:active {
    filter: brightness(90%);
  }
`;

export default Header;
