// Page: ForgotPasswordPage (default export for React.lazy)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, VStack, Text } from '@chakra-ui/react';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { FormField } from '../components/molecules/FormField';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { forgotPasswordFormSchema, ForgotPasswordFormValues } from '../application/schemas/auth.schema';
import { authApi } from '../infrastructure/api/authApi';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema)
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setErrorMsg(null);
      const res = await authApi.requestPasswordReset(values.email);
      setSuccessMsg(res.message);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al solicitar recuperacion');
    }
  };

  return (
    <AuthTemplate
      title="Recuperar Contraseña"
      subtitle="Te enviaremos las instrucciones de restablecimiento a tu correo"
    >
      {successMsg ? (
        <VStack spacing={4} align="stretch">
          <Box bg="rgba(57, 255, 20, 0.1)" borderColor="#39FF14" borderWidth="1px" p={4} borderRadius="xl">
            <Text color="#39FF14" fontSize="sm" fontWeight="600">
              {successMsg}
            </Text>
          </Box>
          <Button onClick={() => navigate('/login')} isFullWidth variant="secondary">
            Volver a Iniciar Sesión
          </Button>
        </VStack>
      ) : (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            {errorMsg && (
              <Box bg="rgba(239, 68, 68, 0.1)" borderColor="red.500" borderWidth="1px" p={3} borderRadius="lg">
                <Text color="red.400" fontSize="sm">
                  {errorMsg}
                </Text>
              </Box>
            )}

            <FormField label="Correo electrónico" error={errors.email?.message} isRequired>
              <Input type="email" placeholder="tu-correo@ejemplo.com" {...register('email')} />
            </FormField>

            <Button type="submit" isLoading={isSubmitting} isFullWidth>
              Enviar Enlace
            </Button>

            <Box textAlign="center" pt={2}>
              <Text
                as="button"
                type="button"
                onClick={() => navigate('/login')}
                fontSize="sm"
                color="zinc.400"
                _hover={{ color: '#39FF14' }}
              >
                &larr; Volver a Iniciar Sesión
              </Text>
            </Box>
          </VStack>
        </Box>
      )}
    </AuthTemplate>
  );
};

export default ForgotPasswordPage;
