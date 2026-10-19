// Page: DashboardPage (default export for React.lazy)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, VStack, HStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { AppShellTemplate } from '../components/templates/AppShellTemplate';
import { Button } from '../components/atoms/Button';
import { useAuthStore } from '../application/stores/authStore';
import { useActiveWorkout } from '../application/hooks/useActiveWorkout';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { isActive, formattedElapsed, sets, loadActiveSession } = useActiveWorkout();

  useEffect(() => {
    loadActiveSession();
  }, [loadActiveSession]);

  return (
    <AppShellTemplate headerTitle="Hypertro">
      <VStack spacing={5} align="stretch">
        {/* Banner de Bienvenida */}
        <Box bg="zinc.900" borderWidth="1px" borderColor="zinc.800" borderRadius="2xl" p={5}>
          <Text fontSize="xs" fontWeight="700" color="#39FF14" textTransform="uppercase" letterSpacing="wider" mb={1}>
            Panel Principal &bull; {user?.role?.toUpperCase()}
          </Text>
          <Heading as="h1" fontSize="2xl" fontWeight="900" color="white" mb={2}>
            &iexcl;A entrenar, {user?.firstName || 'Atleta'}!
          </Heading>
          <Text fontSize="sm" color="zinc.400">
            Aplica sobrecarga progresiva en cada serie. Registra tus cargas y supera tus récords.
          </Text>
        </Box>

        {/* Tarjeta de Sesión Activa */}
        {isActive ? (
          <Box
            bg="rgba(57, 255, 20, 0.05)"
            borderWidth="1px"
            borderColor="#39FF14"
            borderRadius="2xl"
            p={5}
            boxShadow="0 0 15px rgba(57, 255, 20, 0.15)"
          >
            <FlexStatus />
            <Text fontSize="xl" fontWeight="900" color="white" mb={1}>
              Entrenamiento en progreso
            </Text>
            <Text fontSize="sm" color="zinc.400" mb={4}>
              Tiempo transcurrido: <Text as="span" color="#39FF14" fontWeight="800" fontFamily="mono">{formattedElapsed}</Text> &bull; {sets.length} series registradas
            </Text>
            <Button onClick={() => navigate('/workout')} isFullWidth>
              Continuar Entrenando
            </Button>
          </Box>
        ) : (
          <Button onClick={() => navigate('/workout')} isFullWidth size="lg">
            ⚡ Iniciar Nuevo Entrenamiento
          </Button>
        )}

        {/* Resumen de accesos rápidos */}
        <SimpleGrid columns={2} spacing={3}>
          <Box
            as="button"
            onClick={() => navigate('/nutrition')}
            bg="zinc.900"
            borderWidth="1px"
            borderColor="zinc.800"
            borderRadius="xl"
            p={4}
            textAlign="left"
            _hover={{ borderColor: 'zinc.700' }}
          >
            <Text fontSize="2xl" mb={1}>🥗</Text>
            <Text fontSize="md" fontWeight="800" color="white">Nutrición</Text>
            <Text fontSize="xs" color="zinc.400">TDEE y Macros</Text>
          </Box>

          <Box
            as="button"
            onClick={() => navigate('/workout')}
            bg="zinc.900"
            borderWidth="1px"
            borderColor="zinc.800"
            borderRadius="xl"
            p={4}
            textAlign="left"
            _hover={{ borderColor: 'zinc.700' }}
          >
            <Text fontSize="2xl" mb={1}>📈</Text>
            <Text fontSize="md" fontWeight="800" color="white">Sobrecarga</Text>
            <Text fontSize="xs" color="zinc.400">Récords personales</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </AppShellTemplate>
  );
};

const FlexStatus: React.FC = () => (
  <HStack spacing={2} mb={2}>
    <Box w="8px" h="8px" borderRadius="full" bg="#39FF14" boxShadow="0 0 8px #39FF14" />
    <Text fontSize="2xs" fontWeight="800" color="#39FF14" textTransform="uppercase">
      Sesion Activa
    </Text>
  </HStack>
);

export default DashboardPage;
