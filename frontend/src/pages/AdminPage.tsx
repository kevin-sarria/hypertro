// Page: AdminPage (default export for React.lazy)

import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { AppShellTemplate } from '../components/templates/AppShellTemplate';
import { Spinner } from '../components/atoms/Spinner';
import { httpClient } from '../infrastructure/api/httpClient';

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
}

const AdminPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await httpClient.get<AdminMetrics>('/admin/metrics');
        setMetrics(res.data);
      } catch {
        setMetrics({ totalUsers: 1, activeUsers: 1 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <AppShellTemplate headerTitle="Administración">
      <VStack spacing={5} align="stretch">
        <Box bg="zinc.900" borderWidth="1px" borderColor="zinc.800" borderRadius="2xl" p={5}>
          <Heading as="h1" fontSize="xl" fontWeight="900" color="white" mb={1}>
            Plataforma Global &bull; Métricas
          </Heading>
          <Text fontSize="xs" color="zinc.400" mb={4}>
            Resumen en tiempo real del estado de usuarios y actividad en Hypertro.
          </Text>

          {isLoading ? (
            <Box textAlign="center" py={6}>
              <Spinner />
            </Box>
          ) : (
            <SimpleGrid columns={2} spacing={3}>
              <Box bg="zinc.950" p={4} borderRadius="xl">
                <Text fontSize="2xs" color="zinc.400" textTransform="uppercase" fontWeight="700">
                  Total Atletas / Coaches
                </Text>
                <Text fontSize="2xl" fontWeight="900" color="white">
                  {metrics?.totalUsers ?? 0}
                </Text>
              </Box>

              <Box bg="zinc.950" p={4} borderRadius="xl" borderLeftWidth="3px" borderColor="#39FF14">
                <Text fontSize="2xs" color="zinc.400" textTransform="uppercase" fontWeight="700">
                  Usuarios Activos
                </Text>
                <Text fontSize="2xl" fontWeight="900" color="#39FF14">
                  {metrics?.activeUsers ?? 0}
                </Text>
              </Box>
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </AppShellTemplate>
  );
};

export default AdminPage;
