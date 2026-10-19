// Organism: RegisterForm (react-hook-form + zodResolver)

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, VStack, SimpleGrid, Text } from '@chakra-ui/react';
import { registerFormSchema, RegisterFormValues } from '../../application/schemas/auth.schema';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  onNavigateToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onNavigateToLogin }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      birthDate: '1998-01-01',
      avatarUrl: ''
    }
  });

  const handleFormSubmit = async (values: RegisterFormValues) => {
    try {
      setServerError(null);
      await onSubmit(values);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al registrar la cuenta');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} width="100%">
      <VStack spacing={3} align="stretch">
        {serverError && (
          <Box bg="rgba(239, 68, 68, 0.1)" borderColor="red.500" borderWidth="1px" p={3} borderRadius="lg">
            <Text color="red.400" fontSize="sm">
              {serverError}
            </Text>
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
          <FormField label="Nombre" error={errors.firstName?.message} isRequired>
            <Input placeholder="Arnold" {...register('firstName')} />
          </FormField>
          <FormField label="Apellido" error={errors.lastName?.message} isRequired>
            <Input placeholder="Schwarzenegger" {...register('lastName')} />
          </FormField>
        </SimpleGrid>

        <FormField label="Correo electrónico" error={errors.email?.message} isRequired>
          <Input type="email" placeholder="arnold@goldengym.com" {...register('email')} />
        </FormField>

        <FormField
          label="Contraseña (mín. 10 chars, mayúscula y número)"
          error={errors.password?.message}
          isRequired
        >
          <Input type="password" placeholder="••••••••••••" {...register('password')} />
        </FormField>

        <FormField label="Fecha de nacimiento" error={errors.birthDate?.message} isRequired>
          <Input type="date" {...register('birthDate')} />
        </FormField>

        <Button type="submit" isLoading={isSubmitting} isFullWidth mt={3}>
          Crear Cuenta
        </Button>

        {onNavigateToLogin && (
          <Box textAlign="center" pt={3}>
            <Text fontSize="sm" color="zinc.400">
              &iquest;Ya tienes cuenta?{' '}
              <Text
                as="span"
                color="#39FF14"
                fontWeight="700"
                cursor="pointer"
                onClick={onNavigateToLogin}
                _hover={{ textDecoration: 'underline' }}
              >
                Inicia sesión
              </Text>
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
