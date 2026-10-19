// Atom: NumberStepper (Ergonomic +/- buttons for gym workout tracking)

import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';

export interface NumberStepperProps {
  value: number;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  step = 1,
  min = 0,
  max = 1000,
  unit = '',
  onChange
}) => {
  const handleDecrement = () => {
    const nextVal = Math.max(min, Math.round((value - step) * 100) / 100);
    onChange(nextVal);
  };

  const handleIncrement = () => {
    const nextVal = Math.min(max, Math.round((value + step) * 100) / 100);
    onChange(nextVal);
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="zinc.900"
      borderWidth="1px"
      borderColor="zinc.800"
      borderRadius="xl"
      minHeight="56px"
      px={2}
      userSelect="none"
    >
      <Box
        as="button"
        type="button"
        onClick={handleDecrement}
        minW="48px"
        minH="48px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
        fontWeight="bold"
        color="zinc.300"
        borderRadius="lg"
        bg="zinc.800"
        _active={{ bg: 'zinc.700', transform: 'scale(0.95)' }}
      >
        -
      </Box>

      <Flex direction="column" align="center" justify="center" px={3}>
        <Text fontSize="xl" fontWeight="800" color="white" lineHeight="1">
          {value}
        </Text>
        {unit && (
          <Text fontSize="2xs" color="zinc.400" textTransform="uppercase" fontWeight="700">
            {unit}
          </Text>
        )}
      </Flex>

      <Box
        as="button"
        type="button"
        onClick={handleIncrement}
        minW="48px"
        minH="48px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
        fontWeight="bold"
        color="black"
        borderRadius="lg"
        bg="#39FF14"
        _active={{ bg: '#32e012', transform: 'scale(0.95)' }}
      >
        +
      </Box>
    </Flex>
  );
};
