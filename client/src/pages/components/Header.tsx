import styled from '@emotion/styled';
import { FC } from 'react';

interface HeaderProps {
  handleChangePage: (isOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({ handleChangePage }) => {
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
};

export default Header;

const Links = styled.nav`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.8rem;
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
