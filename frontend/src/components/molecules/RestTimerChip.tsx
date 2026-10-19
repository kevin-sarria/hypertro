// Molecule: RestTimerChip (Rest countdown indicator with quick cancellation)

import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { useRestTimer } from '../../application/hooks/useRestTimer';

export const RestTimerChip: React.FC = () => {
  const { isActive, formattedTime, progressPercent, cancelTimer } = useRestTimer();

  if (!isActive) return null;

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="zinc.900"
      borderWidth="1px"
      borderColor="#39FF14"
      borderRadius="full"
      px={3}
      py={1.5}
      gap={3}
      boxShadow="0 0 12px rgba(57, 255, 20, 0.2)"
    >
      <Flex align="center" gap={2}>
        <Box
          w="10px"
          h="10px"
          borderRadius="full"
          bg="#39FF14"
          animation="pulse 1.5s infinite"
        />
        <Text fontSize="xs" fontWeight="700" color="zinc.300">
          Descanso:
        </Text>
        <Text fontSize="sm" fontWeight="800" color="#39FF14" fontFamily="mono">
          {formattedTime}
        </Text>
      </Flex>

      {/* Barra de progreso miniatura */}
      <Box w="40px" h="4px" bg="zinc.800" borderRadius="full" overflow="hidden">
        <Box w={`${progressPercent}%`} h="100%" bg="#39FF14" transition="width 0.5s ease" />
      </Box>

      <Box
        as="button"
        type="button"
        onClick={cancelTimer}
        fontSize="xs"
        color="zinc.400"
        fontWeight="bold"
        _hover={{ color: 'white' }}
        px={1}
      >
        &times;
      </Box>
    </Flex>
  );
};
