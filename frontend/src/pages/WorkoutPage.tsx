// Page: WorkoutPage (default export for React.lazy)

import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { AppShellTemplate } from '../components/templates/AppShellTemplate';
import { ActiveWorkoutPanel } from '../components/organisms/ActiveWorkoutPanel';
import { SetLogger } from '../components/organisms/SetLogger';
import { Button } from '../components/atoms/Button';
import { Spinner } from '../components/atoms/Spinner';
import { useActiveWorkout } from '../application/hooks/useActiveWorkout';
import { LogSetFormValues } from '../application/schemas/workout.schema';

const WorkoutPage: React.FC = () => {
  const {
    session,
    isActive,
    activeExerciseId,
    sets,
    lastPreviousSession,
    formattedElapsed,
    isLoading,
    error,
    loadActiveSession,
    startSession,
    logSet,
    finishSession
  } = useActiveWorkout();

  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    loadActiveSession();
  }, [loadActiveSession]);

  const handleStart = async () => {
    await startSession();
  };

  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      await finishSession('Sesión completada con éxito');
    } finally {
      setIsFinishing(false);
    }
  };

  const handleLogSet = async (values: LogSetFormValues) => {
    await logSet({
      exerciseId: activeExerciseId ?? 1,
      setNumber: sets.length + 1,
      weightKg: values.weightKg,
      reps: values.reps,
      rir: values.rir,
      rpe: values.rpe,
      feeling: values.feeling,
      restSeconds: values.restSeconds
    });
  };

  if (isLoading && !session) {
    return (
      <AppShellTemplate headerTitle="Entrenamiento">
        <Box textAlign="center" py={12}>
          <Spinner size="xl" />
          <Text color="zinc.400" mt={3} fontSize="sm">
            Cargando sesión...
          </Text>
        </Box>
      </AppShellTemplate>
    );
  }

  return (
    <AppShellTemplate headerTitle="Entrenamiento">
      <VStack spacing={4} align="stretch">
        {error && (
          <Box bg="rgba(239, 68, 68, 0.1)" borderColor="red.500" borderWidth="1px" p={3} borderRadius="lg">
            <Text color="red.400" fontSize="sm">
              {error}
            </Text>
          </Box>
        )}

        {!isActive ? (
          <Box bg="zinc.900" borderWidth="1px" borderColor="zinc.800" borderRadius="2xl" p={6} textAlign="center">
            <Text fontSize="4xl" mb={3}>🏋️‍♂️</Text>
            <Heading as="h2" fontSize="xl" fontWeight="900" color="white" mb={2}>
              ¿Listo para entrenar?
            </Heading>
            <Text fontSize="sm" color="zinc.400" mb={6}>
              Inicia una nueva sesión para registrar tus series, seguir los tiempos de descanso y monitorear tus marcas.
            </Text>
            <Button onClick={handleStart} isFullWidth size="lg">
              Iniciar Sesión de Entrenamiento
            </Button>
          </Box>
        ) : (
          <>
            {/* Panel de sesión en vivo */}
            <ActiveWorkoutPanel
              elapsedTime={formattedElapsed}
              sets={sets}
              onFinishSession={handleFinish}
              isFinishing={isFinishing}
            />

            {/* Logger ergonómico de serie con botón en zona del pulgar */}
            <SetLogger
              exerciseId={activeExerciseId ?? 1}
              exerciseName="Press de Banca Plano con Barra"
              setNumber={sets.length + 1}
              previousSession={lastPreviousSession}
              onLogSet={handleLogSet}
            />
          </>
        )}
      </VStack>
    </AppShellTemplate>
  );
};

export default WorkoutPage;
