// Page: LoginPage (default export for React.lazy)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { useAuth } from '../application/hooks/useAuth';
import { LoginFormValues } from '../application/schemas/auth.schema';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);
    navigate('/');
  };

  return (
    <AuthTemplate
      title="Iniciar Sesión"
      subtitle="Accede a tu plan de entrenamiento de alto rendimiento"
    >
      <LoginForm
        onSubmit={handleLogin}
        onNavigateToRegister={() => navigate('/register')}
        onNavigateToForgot={() => navigate('/forgot-password')}
      />
    </AuthTemplate>
  );
};

export default LoginPage;
