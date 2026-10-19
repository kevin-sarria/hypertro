// Page: RegisterPage (default export for React.lazy)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { RegisterForm } from '../components/organisms/RegisterForm';
import { useAuth } from '../application/hooks/useAuth';
import { RegisterFormValues } from '../application/schemas/auth.schema';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (values: RegisterFormValues) => {
    await register(values);
    navigate('/');
  };

  return (
    <AuthTemplate
      title="Crear Cuenta"
      subtitle="Únete a Hypertro y lleva tu rendimiento al límite"
    >
      <RegisterForm
        onSubmit={handleRegister}
        onNavigateToLogin={() => navigate('/login')}
      />
    </AuthTemplate>
  );
};

export default RegisterPage;
