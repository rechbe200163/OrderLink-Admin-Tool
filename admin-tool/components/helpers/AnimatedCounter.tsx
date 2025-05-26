'use client';

import CountUp from 'react-countup';

type AnimatedCounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
};

const AnimatedCounter = ({
  value,
  decimals = 0,
  prefix = '',
}: AnimatedCounterProps) => {
  return (
    <CountUp
      start={0}
      end={value}
      duration={2.5}
      separator=' '
      decimal='.'
      decimals={decimals}
      prefix={String(prefix)}
    />
  );
};

export default AnimatedCounter;
