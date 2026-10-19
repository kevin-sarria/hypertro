// Molecule: SetInputRow (Weight and Reps Steppers aligned side by side)

import React from 'react';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import { NumberStepper } from '../atoms/NumberStepper';

export interface SetInputRowProps {
  weightKg: number;
  reps: number;
  onWeightChange: (val: number) => void;
  onRepsChange: (val: number) => void;
}

export const SetInputRow: React.FC<SetInputRowProps> = ({
  weightKg,
  reps,
  onWeightChange,
  onRepsChange
}) => {
  return (
    <SimpleGrid columns={2} spacing={3} width="100%">
      <Box>
        <Text fontSize="xs" fontWeight="700" color="zinc.400" mb={1} textTransform="uppercase">
          Carga (kg)
        </Text>
        <NumberStepper
          value={weightKg}
          step={2.5}
          min={0}
          max={600}
          unit="kg"
          onChange={onWeightChange}
        />
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="700" color="zinc.400" mb={1} textTransform="uppercase">
          Repeticiones
        </Text>
        <NumberStepper
          value={reps}
          step={1}
          min={1}
          max={100}
          unit="reps"
          onChange={onRepsChange}
        />
      </Box>
    </SimpleGrid>
  );
};
