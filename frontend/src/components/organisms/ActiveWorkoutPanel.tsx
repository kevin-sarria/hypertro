// Organism: ActiveWorkoutPanel

import React from 'react';
import { Box, VStack, HStack, Text, Flex } from '@chakra-ui/react';
import { SetLog } from '../../domain/entities/SetLog';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { RestTimerChip } from '../molecules/RestTimerChip';

export interface ActiveWorkoutPanelProps {
  elapsedTime: string;
  sets: SetLog[];
  onFinishSession: () => void;
  isFinishing?: boolean;
}

export const ActiveWorkoutPanel: React.FC<ActiveWorkoutPanelProps> = ({
  elapsedTime,
  sets,
  onFinishSession,
  isFinishing = false
}) => {
  const totalVolume = sets.reduce((acc, s) => acc + s.volume, 0);

  return (
    <Box bg="zinc.900" borderWidth="1px" borderColor="zinc.800" borderRadius="2xl" p={4} mb={4}>
      {/* Barra superior de estado */}
      <Flex justify="space-between" align="center" mb={3}>
        <HStack spacing={2}>
          <Box w="10px" h="10px" borderRadius="full" bg="#39FF14" boxShadow="0 0 10px #39FF14" />
          <Text fontSize="sm" fontWeight="800" color="white" textTransform="uppercase" letterSpacing="wider">
            Sesión en Vivo
          </Text>
        </HStack>

        <Text fontSize="lg" fontWeight="900" color="#39FF14" fontFamily="mono">
          {elapsedTime}
        </Text>
      </Flex>

      {/* Temporizador de descanso flotante o incrustado */}
      <Box mb={3}>
        <RestTimerChip />
      </Box>

      {/* Métricas rápidas */}
      <Flex justify="space-between" bg="zinc.950" p={3} borderRadius="xl" mb={3}>
        <Box>
          <Text fontSize="2xs" color="zinc.400" fontWeight="700" textTransform="uppercase">
            Series Totales
          </Text>
          <Text fontSize="lg" fontWeight="800" color="white">
            {sets.length}
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="2xs" color="zinc.400" fontWeight="700" textTransform="uppercase">
            Volumen Acumulado
          </Text>
          <Text fontSize="lg" fontWeight="800" color="white">
            {totalVolume.toLocaleString()} kg
          </Text>
        </Box>
      </Flex>

      {/* Historial de series en esta sesión */}
      {sets.length > 0 && (
        <VStack spacing={2} align="stretch" maxH="200px" overflowY="auto" mb={3} pr={1}>
          {sets.map((s) => (
            <Flex
              key={s.id || `${s.sessionId}-${s.exerciseId}-${s.setNumber}`}
              justify="space-between"
              align="center"
              bg="zinc.950"
              px={3}
              py={2}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={s.isPersonalRecord ? 'rgba(57, 255, 20, 0.4)' : 'zinc.800'}
            >
              <HStack spacing={2}>
                <Text fontSize="xs" fontWeight="700" color="zinc.400">
                  #{s.setNumber}
                </Text>
                <Text fontSize="sm" fontWeight="800" color="white">
                  {s.weightKg} kg &times; {s.reps} reps
                </Text>
                {s.rpe && (
                  <Text fontSize="2xs" color="zinc.400">
                    @{s.rpe}
                  </Text>
                )}
              </HStack>

              <HStack spacing={2}>
                {s.isPersonalRecord && <Badge isPR>PR</Badge>}
                <Text fontSize="xs" color="zinc.400" textTransform="capitalize">
                  {s.feeling ?? ''}
                </Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      )}

      {/* Botón de finalizar entrenamiento */}
      <Button
        variant="secondary"
        onClick={onFinishSession}
        isLoading={isFinishing}
        isFullWidth
        minHeight="48px"
        fontSize="sm"
      >
        Finalizar Entrenamiento
      </Button>
    </Box>
  );
};
