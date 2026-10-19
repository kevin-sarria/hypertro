// Atom: Input

import React, { forwardRef } from 'react';
import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';

export interface InputProps extends ChakraInputProps {
  isError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ isError, ...props }, ref) => {
  return (
    <ChakraInput
      ref={ref}
      isInvalid={isError}
      minHeight="56px"
      fontSize="lg"
      bg="zinc.900"
      borderColor={isError ? 'red.500' : 'zinc.800'}
      borderRadius="xl"
      color="white"
      _focus={{
        borderColor: isError ? 'red.400' : '#39FF14',
        boxShadow: isError ? '0 0 0 1px #f56565' : '0 0 0 1px #39FF14'
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input';
