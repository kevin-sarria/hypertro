// Atom: Button

import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface ButtonProps extends ChakraButtonProps {
  variant?: 'solid' | 'secondary' | 'ghost' | 'outline';
  isFullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  isFullWidth = false,
  ...props
}) => {
  return (
    <ChakraButton
      variant={variant}
      width={isFullWidth ? '100%' : 'auto'}
      minHeight="56px"
      fontSize="md"
      fontWeight="700"
      borderRadius="xl"
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
