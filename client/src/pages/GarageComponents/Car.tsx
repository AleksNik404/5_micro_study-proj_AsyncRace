import styled from '@emotion/styled';
import clsx from 'clsx';
import React, { useEffect } from 'react';

import SvgCar from '@/assets/SvgCar';
import { CarAnimation } from '@/helpers/carAnimation';

type Props = {
  color: string;
  status?: string;

  animationTime: number;
};

const Car = ({ status, color, animationTime }: Props) => {
  const carAnimation = React.useRef<CarAnimation>();
  const carRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carRef.current) carAnimation.current = new CarAnimation(carRef.current);

    return () => {
      carAnimation.current?.reset();
      carAnimation.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (status === 'stopped') carAnimation.current?.stop();
    if (status === 'run') carAnimation.current?.start(animationTime);
    if (status === 'broken') carAnimation.current?.stop();

    if (!status) {
      carAnimation.current?.reset();
    }
  }, [animationTime, status]);

  const isBroken = status === 'broken';

  return (
    <SvgBox className={clsx({ broken: isBroken })} ref={carRef}>
      <SvgCar fill={color} width="70px" height="50px" />
    </SvgBox>
  );
};

export default Car;

const SvgBox = styled.div`
  width: min-content;
  position: relative;
  overflow: hidden;
  bottom: -18px;

  position: relative;

  &.broken::after,
  &.broken::before {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background-color: red;

    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
  }
  &.broken::after {
    transform: translate(-50%, -50%) rotate(35deg);
  }
  &.broken::before {
    transform: translate(-50%, -50%) rotate(-35deg);
  }
`;
