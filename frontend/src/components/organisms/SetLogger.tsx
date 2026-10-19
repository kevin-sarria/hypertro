// Organism: SetLogger (Gym-optimized logger with fixed bottom thumb zone button)

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, VStack, Text, Flex, SimpleGrid, Select } from '@chakra-ui/react';
import { logSetFormSchema, LogSetFormValues } from '../../application/schemas/workout.schema';
import { PreviousSessionSummary, Feeling } from '../../domain/entities/SetLog';
import { PreviousSetHint } from '../molecules/PreviousSetHint';
import { SetInputRow } from '../molecules/SetInputRow';
import { RpeSelector } from '../molecules/RpeSelector';
import { Button } from '../atoms/Button';

export interface SetLoggerProps {
  exerciseId: number;
  exerciseName: string;
  setNumber: number;
  previousSession?: PreviousSessionSummary | null;
  onLogSet: (data: LogSetFormValues) => Promise<void>;
}

export const SetLogger: React.FC<SetLoggerProps> = ({
  exerciseName,
  setNumber,
  previousSession,
  onLogSet
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Precargar sugerencia con la marca de la sesión previa si existe
  const defaultWeight = previousSession?.maxWeightKg ? Number(previousSession.maxWeightKg) : 60;
  const defaultReps = previousSession?.repsAtMaxWeight ? Number(previousSession.repsAtMaxWeight) : 10;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<LogSetFormValues>({
    resolver: zodResolver(logSetFormSchema),
    defaultValues: {
      weightKg: defaultWeight,
      reps: defaultReps,
      rir: 2,
      rpe: 8.0,
      feeling: 'good' as Feeling,
      restSeconds: 90
    }
  });

  const weightKg = watch('weightKg');
  const reps = watch('reps');
  const rpe = watch('rpe');

  const onSubmit = async (values: LogSetFormValues) => {
    try {
      setErrorMsg(null);
      await onLogSet(values);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar serie');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} pb="90px">
      <VStack spacing={4} align="stretch">
        {/* Cabecera del ejercicio actual */}
        <Flex justify="space-between" align="center" bg="zinc.900" p={3.5} borderRadius="xl" borderWidth="1px" borderColor="zinc.800">
          <Box>
            <Text fontSize="lg" fontWeight="800" color="white">
              {exerciseName}
            </Text>
            <Text fontSize="xs" fontWeight="600" color="zinc.400">
              Serie #{setNumber}
            </Text>
          </Box>
        </Flex>

        {/* Indicador de marca anterior para sobrecarga progresiva */}
        <PreviousSetHint summary={previousSession} />

        {errorMsg && (
          <Box bg="rgba(239, 68, 68, 0.1)" borderColor="red.500" borderWidth="1px" p={3} borderRadius="lg">
            <Text color="red.400" fontSize="sm">
              {errorMsg}
            </Text>
          </Box>
        )}

        {/* Steppers táctiles ergonómicos de Peso y Repeticiones */}
        <SetInputRow
          weightKg={weightKg}
          reps={reps}
          onWeightChange={(val) => setValue('weightKg', val)}
          onRepsChange={(val) => setValue('reps', val)}
        />

        {/* Selector de RPE con botones táctiles */}
        <RpeSelector
          value={rpe ?? null}
          onChange={(newRpe) => setValue('rpe', newRpe)}
        />

        {/* Parámetros complementarios: RIR y Sensación */}
        <SimpleGrid columns={2} spacing={3}>
          <Box>
            <Text fontSize="xs" fontWeight="700" color="zinc.400" mb={1} textTransform="uppercase">
              RIR (Reps en recámara)
            </Text>
            <Controller
              name="rir"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  bg="zinc.900"
                  borderColor="zinc.800"
                  minHeight="56px"
                  borderRadius="xl"
                  color="white"
                >
                  <option value="0">0 (Al fallo muscular)</option>
                  <option value="1">1 rep</option>
                  <option value="2">2 reps</option>
                  <option value="3">3 reps</option>
                  <option value="4">4+ reps</option>
                </Select>
              )}
            />
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="700" color="zinc.400" mb={1} textTransform="uppercase">
              Sensación
            </Text>
            <Controller
              name="feeling"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : (e.target.value as Feeling))}
                  bg="zinc.900"
                  borderColor="zinc.800"
                  minHeight="56px"
                  borderRadius="xl"
                  color="white"
                >
                  <option value="great">Excelente (Fuerte)</option>
                  <option value="good">Buena (Normal)</option>
                  <option value="ok">Regular</option>
                  <option value="bad">Pesada / Fatigado</option>
                </Select>
              )}
            />
          </Box>
        </SimpleGrid>
      </VStack>

      {/* Botón flotante fijado en la parte inferior (zona ergonómica del pulgar) */}
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="rgba(9, 9, 11, 0.95)"
        backdropFilter="blur(10px)"
        borderTopWidth="1px"
        borderColor="zinc.800"
        p={3}
        zIndex={100}
        maxW="600px"
        mx="auto"
      >
        <Button
          type="submit"
          isLoading={isSubmitting}
          isFullWidth
          variant="solid"
          boxShadow="0 0 20px rgba(57, 255, 20, 0.35)"
        >
          REGISTRAR SERIE #{setNumber} ({weightKg} kg &times; {reps})
        </Button>
      </Box>
    </Box>
  );
};
