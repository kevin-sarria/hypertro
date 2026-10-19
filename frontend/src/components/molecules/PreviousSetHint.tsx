// Molecule: PreviousSetHint (Shows previous session baseline for progressive overload)

import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { PreviousSessionSummary } from '../../domain/entities/SetLog';

export interface PreviousSetHintProps {
  summary: PreviousSessionSummary | null | undefined;
}

export const PreviousSetHint: React.FC<PreviousSetHintProps> = ({ summary }) => {
  if (!summary || summary.maxWeightKg === null || summary.repsAtMaxWeight === null) {
    return (
      <Flex
        align="center"
        bg="zinc.900"
        borderWidth="1px"
        borderColor="zinc.800"
        borderRadius="lg"
        px={3}
        py={2}
        gap={2}
      >
        <Box w="8px" h="8px" borderRadius="full" bg="zinc.500" />
        <Text fontSize="xs" color="zinc.400" fontWeight="500">
          Sin historial previo registrado. &iexcl;Establece tu primera marca hoy!
        </Text>
      </Flex>
    );
  }

  const dateStr = summary.previousSessionDate
    ? new Date(summary.previousSessionDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      })
    : 'Ultima sesion';

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="rgba(57, 255, 20, 0.05)"
      borderWidth="1px"
      borderColor="rgba(57, 255, 20, 0.3)"
      borderRadius="lg"
      px={3}
      py={2}
    >
      <Flex align="center" gap={2}>
        <Box w="8px" h="8px" borderRadius="full" bg="#39FF14" boxShadow="0 0 8px #39FF14" />
        <Text fontSize="xs" color="zinc.300" fontWeight="600">
          Marca anterior ({dateStr}):
        </Text>
      </Flex>
      <Text fontSize="xs" fontWeight="800" color="#39FF14">
        {summary.maxWeightKg} kg &times; {summary.repsAtMaxWeight} reps
      </Text>
    </Flex>
  );
};
