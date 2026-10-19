// Page: NutritionPage (default export for React.lazy)

import React, { useState } from 'react';
import { Box, VStack, Heading, Text, SimpleGrid, Select } from '@chakra-ui/react';
import { AppShellTemplate } from '../components/templates/AppShellTemplate';
import { FormField } from '../components/molecules/FormField';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { httpClient } from '../infrastructure/api/httpClient';

interface TdeeResult {
  bmr: number;
  tdee: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  proteinKcal: number;
  fatKcal: number;
  carbsKcal: number;
}

const NutritionPage: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [age, setAge] = useState<number>(25);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<number>(1.55);

  const [tdeeResult, setTdeeResult] = useState<TdeeResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const calculateTdee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCalculating(true);
      const res = await httpClient.post<TdeeResult>('/nutrition/tdee', {
        weightKg,
        heightCm,
        age,
        sex,
        activityMultiplier: activity
      });
      setTdeeResult(res.data);
    } catch {
      // Cálculo local de respaldo
      let base = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
      const bmr = Math.round(base);
      const tdee = Math.round(bmr * activity);
      const proteinG = Math.round(2 * weightKg);
      const proteinKcal = proteinG * 4;
      const fatKcal = Math.round(tdee * 0.25);
      const fatG = Math.round(fatKcal / 9);
      const carbsKcal = Math.max(0, tdee - proteinKcal - fatKcal);
      const carbsG = Math.round(carbsKcal / 4);

      setTdeeResult({
        bmr,
        tdee,
        proteinG,
        fatG,
        carbsG,
        proteinKcal,
        fatKcal,
        carbsKcal
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <AppShellTemplate headerTitle="Nutrición y Macros">
      <VStack spacing={5} align="stretch">
        <Box bg="zinc.900" borderWidth="1px" borderColor="zinc.800" borderRadius="2xl" p={5}>
          <Heading as="h2" fontSize="lg" fontWeight="800" color="white" mb={1}>
            Calculadora TDEE (Mifflin-St Jeor)
          </Heading>
          <Text fontSize="xs" color="zinc.400" mb={4}>
            Estima tu gasto calórico total diario y distribución óptima de macronutrientes para hipertrofia.
          </Text>

          <Box as="form" onSubmit={calculateTdee}>
            <SimpleGrid columns={2} spacing={3}>
              <FormField label="Peso (kg)" isRequired>
                <Input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Altura (cm)" isRequired>
                <Input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
              </FormField>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={3}>
              <FormField label="Edad" isRequired>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Sexo" isRequired>
                <Select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'male' | 'female')}
                  bg="zinc.900"
                  borderColor="zinc.800"
                  minHeight="56px"
                  borderRadius="xl"
                  color="white"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </Select>
              </FormField>
            </SimpleGrid>

            <FormField label="Nivel de Actividad" isRequired>
              <Select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                bg="zinc.900"
                borderColor="zinc.800"
                minHeight="56px"
                borderRadius="xl"
                color="white"
              >
                <option value={1.2}>Sedentario (Oficina / Sin ejercicio)</option>
                <option value={1.375}>Ligero (1-3 días de gym)</option>
                <option value={1.55}>Moderado (3-5 días de gym)</option>
                <option value={1.725}>Muy Activo (6-7 días de alta intensidad)</option>
              </Select>
            </FormField>

            <Button type="submit" isLoading={isCalculating} isFullWidth mt={2}>
              Calcular Macros
            </Button>
          </Box>
        </Box>

        {tdeeResult && (
          <Box bg="zinc.900" borderWidth="1px" borderColor="#39FF14" borderRadius="2xl" p={5}>
            <Text fontSize="xs" fontWeight="700" color="#39FF14" textTransform="uppercase" mb={2}>
              Resultados Nutricionales
            </Text>
            <SimpleGrid columns={2} spacing={3} mb={4}>
              <Box bg="zinc.950" p={3} borderRadius="xl">
                <Text fontSize="2xs" color="zinc.400" textTransform="uppercase" fontWeight="700">
                  Metabolismo Basal (BMR)
                </Text>
                <Text fontSize="xl" fontWeight="900" color="white">
                  {tdeeResult.bmr} kcal
                </Text>
              </Box>

              <Box bg="zinc.950" p={3} borderRadius="xl" borderLeftWidth="3px" borderColor="#39FF14">
                <Text fontSize="2xs" color="zinc.400" textTransform="uppercase" fontWeight="700">
                  Gasto Total (TDEE)
                </Text>
                <Text fontSize="xl" fontWeight="900" color="#39FF14">
                  {tdeeResult.tdee} kcal
                </Text>
              </Box>
            </SimpleGrid>

            <Text fontSize="xs" fontWeight="700" color="zinc.300" mb={2}>
              Reparto de Macronutrientes para Hipertrofia:
            </Text>

            <SimpleGrid columns={3} spacing={2}>
              <Box bg="zinc.950" p={3} borderRadius="xl" textAlign="center">
                <Text fontSize="2xs" color="blue.400" fontWeight="700">PROTEÍNA (2g/kg)</Text>
                <Text fontSize="lg" fontWeight="900" color="white">{tdeeResult.proteinG} g</Text>
                <Text fontSize="2xs" color="zinc.500">{tdeeResult.proteinKcal} kcal</Text>
              </Box>

              <Box bg="zinc.950" p={3} borderRadius="xl" textAlign="center">
                <Text fontSize="2xs" color="yellow.400" fontWeight="700">GRASAS (25%)</Text>
                <Text fontSize="lg" fontWeight="900" color="white">{tdeeResult.fatG} g</Text>
                <Text fontSize="2xs" color="zinc.500">{tdeeResult.fatKcal} kcal</Text>
              </Box>

              <Box bg="zinc.950" p={3} borderRadius="xl" textAlign="center">
                <Text fontSize="2xs" color="green.400" fontWeight="700">CARBOS (Resto)</Text>
                <Text fontSize="lg" fontWeight="900" color="white">{tdeeResult.carbsG} g</Text>
                <Text fontSize="2xs" color="zinc.500">{tdeeResult.carbsKcal} kcal</Text>
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </AppShellTemplate>
  );
};

export default NutritionPage;
