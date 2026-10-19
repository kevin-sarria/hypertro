// Organism: LoginForm (react-hook-form + zodResolver)

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, VStack, Text } from '@chakra-ui/react';
import { loginFormSchema, LoginFormValues } from '../../application/schemas/auth.schema';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onNavigateToRegister?: () => void;
  onNavigateToForgot?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onNavigateToRegister,
  onNavigateToForgot
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleFormSubmit = async (values: LoginFormValues) => {
    try {
      setServerError(null);
      await onSubmit(values);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al iniciar sesion');
    }
  };

  return (
    <Box as="form" noValidate onSubmit={handleSubmit(handleFormSubmit)} width="100%">
      <VStack spacing={4} align="stretch">
        {serverError && (
          <Box bg="rgba(239, 68, 68, 0.1)" borderColor="red.500" borderWidth="1px" p={3} borderRadius="lg">
            <Text color="red.400" fontSize="sm">
              {serverError}
            </Text>
          </Box>
        )}

        <FormField label="Correo electrónico" error={errors.email?.message} isRequired>
          <Input
            type="email"
            placeholder="atleta@hypertro.app"
            autoComplete="email"
            {...register('email')}
          />
        </FormField>

        <FormField label="Contraseña" error={errors.password?.message} isRequired>
          <Input
            type="password"
            placeholder="••••••••••••"
            autoComplete="current-password"
            {...register('password')}
          />
        </FormField>

        {onNavigateToForgot && (
          <Box textAlign="right">
            <Text
              as="button"
              type="button"
              onClick={onNavigateToForgot}
              fontSize="xs"
              color="#39FF14"
              fontWeight="600"
              _hover={{ textDecoration: 'underline' }}
            >
              &iquest;Olvidaste tu contrase&ntilde;a?
            </Text>
          </Box>
        )}

        <Button type="submit" isLoading={isSubmitting} isFullWidth mt={2}>
          Iniciar Sesión
        </Button>

        {onNavigateToRegister && (
          <Box textAlign="center" pt={3}>
            <Text fontSize="sm" color="zinc.400">
              &iquest;A&uacute;n no tienes cuenta?{' '}
              <Text
                as="span"
                color="#39FF14"
                fontWeight="700"
                cursor="pointer"
                onClick={onNavigateToRegister}
                _hover={{ textDecoration: 'underline' }}
              >
                Reg&iacute;strate
              </Text>
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
