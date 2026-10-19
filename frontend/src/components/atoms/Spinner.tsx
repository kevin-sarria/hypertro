// Atom: Spinner

import React from 'react';
import { Spinner as ChakraSpinner, SpinnerProps as ChakraSpinnerProps } from '@chakra-ui/react';

export const Spinner: React.FC<ChakraSpinnerProps> = (props) => {
  return (
    <ChakraSpinner
      thickness="3px"
      speed="0.65s"
      emptyColor="zinc.800"
      color="#39FF14"
      size="md"
      {...props}
    />
  );
};
