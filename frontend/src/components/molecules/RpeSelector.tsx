// Molecule: RpeSelector (Rate of Perceived Exertion quick selector)

import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';

export interface RpeSelectorProps {
  value: number | null;
  onChange: (rpe: number | null) => void;
}

const RPE_VALUES = [6.0, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

export const RpeSelector: React.FC<RpeSelectorProps> = ({ value, onChange }) => {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" color="zinc.400" mb={1.5} textTransform="uppercase">
        RPE (Esfuerzo percibido)
      </Text>
      <Flex gap={1.5} overflowX="auto" pb={1} sx={{ '::-webkit-scrollbar': { display: 'none' } }}>
        {RPE_VALUES.map((rpe) => {
          const isSelected = value === rpe;
          return (
            <Box
              as="button"
              type="button"
              key={rpe}
              onClick={() => onChange(isSelected ? null : rpe)}
              minW="44px"
              minH="44px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="lg"
              fontWeight="800"
              fontSize="sm"
              bg={isSelected ? '#39FF14' : 'zinc.900'}
              color={isSelected ? 'black' : 'zinc.300'}
              borderWidth="1px"
              borderColor={isSelected ? '#39FF14' : 'zinc.800'}
              transition="all 0.15s"
              flexShrink={0}
            >
              {rpe}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
