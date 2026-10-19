// Page: CoachPage (default export for React.lazy)

import React, { useState } from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { AppShellTemplate } from '../components/templates/AppShellTemplate';
import { FormField } from '../components/molecules/FormField';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { httpClient } from '../infrastructure/api/httpClient';

interface ProvisionResult {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  temporaryPassword: string;
  squadId: number;
}

const CoachPage: React.FC = () => {
  const [squadId, setSquadId] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ProvisionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await httpClient.post<ProvisionResult>('/squads/provision', {
        squadId,
        email,
        firstName,
        lastName,
        birthDate
      });
      setResult(res.data);
      setEmail('');
      setFirstName('');
      setLastName('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al aprovisionar al atleta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShellTemplate headerTitle="Panel de Entrenador">
      <VStack spacing={5} align="stretch">
        <Box bg="zinc.900" borderWidth="1px" borderColor="zinc.800" borderRadius="2xl" p={5}>
          <Heading as="h2" fontSize="lg" fontWeight="800" color="white" mb={1}>
            Aprovisionar Alumno (Gymrat)
          </Heading>
          <Text fontSize="xs" color="zinc.400" mb={4}>
            Crea una cuenta para tu atleta y genera una clave temporal de un solo uso.
          </Text>

          {errorMsg && (
            <Box bg="rgba(239, 68, 68, 0.1)" borderColor="red.500" borderWidth="1px" p={3} borderRadius="lg" mb={3}>
              <Text color="red.400" fontSize="sm">{errorMsg}</Text>
            </Box>
          )}

          <Box as="form" onSubmit={handleProvision}>
            <FormField label="ID del Squad" isRequired>
              <Input
                type="number"
                value={squadId}
                onChange={(e) => setSquadId(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Nombre" isRequired>
              <Input
                placeholder="Sergio"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormField>

            <FormField label="Apellido" isRequired>
              <Input
                placeholder="Oliva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormField>

            <FormField label="Correo del atleta" isRequired>
              <Input
                type="email"
                placeholder="sergio@hypertro.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Fecha de Nacimiento" isRequired>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </FormField>

            <Button type="submit" isLoading={isLoading} isFullWidth mt={2}>
              Aprovisionar Atleta y Generar Clave
            </Button>
          </Box>
        </Box>

        {result && (
          <Box bg="rgba(57, 255, 20, 0.05)" borderWidth="1px" borderColor="#39FF14" borderRadius="2xl" p={5}>
            <Text fontSize="xs" fontWeight="700" color="#39FF14" textTransform="uppercase" mb={1}>
              &iexcl;Atleta aprovisionado con éxito!
            </Text>
            <Text fontSize="sm" color="zinc.300" mb={3}>
              Comparte la credencial temporal directamente con tu alumno. Se le pedirá cambiarla al entrar:
            </Text>
            <Box bg="zinc.950" p={3} borderRadius="xl" borderWidth="1px" borderColor="zinc.800">
              <Text fontSize="xs" color="zinc.400">Usuario: <Text as="span" color="white" fontWeight="bold">{result.user.email}</Text></Text>
              <Text fontSize="xs" color="zinc.400" mt={1}>
                Contraseña Temporal:{' '}
                <Text as="span" color="#39FF14" fontWeight="800" fontFamily="mono" fontSize="md">
                  {result.temporaryPassword}
                </Text>
              </Text>
            </Box>
          </Box>
        )}
      </VStack>
    </AppShellTemplate>
  );
};

export default CoachPage;
