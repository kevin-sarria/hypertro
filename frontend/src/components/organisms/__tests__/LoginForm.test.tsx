import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { LoginForm } from '../LoginForm';
import { chakraTheme } from '../../../theme/chakraTheme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={chakraTheme}>{ui}</ChakraProvider>);
};

describe('LoginForm', () => {
  it('displays validation error message when email is invalid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithTheme(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByPlaceholderText('atleta@hypertro.app');
    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    const submitButton = screen.getByRole('button', { name: /iniciar sesi[oó]n/i });

    // Type invalid email and password
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'Secret1234');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correo electronico invalido')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithTheme(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByPlaceholderText('atleta@hypertro.app');
    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    const submitButton = screen.getByRole('button', { name: /iniciar sesi[oó]n/i });

    await user.type(emailInput, 'atleta@hypertro.app');
    await user.type(passwordInput, 'Password1234');
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'atleta@hypertro.app',
        password: 'Password1234'
      });
    });
  });

  it('renders server error message if onSubmit throws an exception', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Credenciales invalidas'));

    renderWithTheme(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByPlaceholderText('atleta@hypertro.app');
    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    const submitButton = screen.getByRole('button', { name: /iniciar sesi[oó]n/i });

    await user.type(emailInput, 'atleta@hypertro.app');
    await user.type(passwordInput, 'Password1234');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciales invalidas')).toBeInTheDocument();
    });
  });

  it('triggers navigation callbacks when navigation links are clicked', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleRegister = vi.fn();
    const handleForgot = vi.fn();

    renderWithTheme(
      <LoginForm
        onSubmit={handleSubmit}
        onNavigateToRegister={handleRegister}
        onNavigateToForgot={handleForgot}
      />
    );

    const forgotBtn = screen.getByText(/¿olvidaste tu contraseña\?/i);
    await user.click(forgotBtn);
    expect(handleForgot).toHaveBeenCalledTimes(1);

    const registerLink = screen.getByText(/regístrate/i);
    await user.click(registerLink);
    expect(handleRegister).toHaveBeenCalledTimes(1);
  });
});
