import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { SetLogger } from '../SetLogger';
import { PreviousSessionSummary } from '../../../domain/entities/SetLog';
import { chakraTheme } from '../../../theme/chakraTheme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={chakraTheme}>{ui}</ChakraProvider>);
};

describe('SetLogger', () => {
  const defaultProps = {
    exerciseId: 1,
    exerciseName: 'Press de Banca Plano',
    setNumber: 2,
    previousSession: null,
    onLogSet: vi.fn().mockResolvedValue(undefined)
  };

  it('renders PreviousSetHint empty state when no previous session exists', () => {
    renderWithTheme(<SetLogger {...defaultProps} previousSession={null} />);

    expect(screen.getByText('Press de Banca Plano')).toBeInTheDocument();
    expect(screen.getByText('Serie #2')).toBeInTheDocument();
    expect(
      screen.getByText(/Sin historial previo registrado/i)
    ).toBeInTheDocument();
  });

  it('renders PreviousSetHint with previous session performance metrics', () => {
    const previousSession: PreviousSessionSummary = {
      previousSessionId: 12,
      previousSessionDate: '2026-10-10',
      maxWeightKg: 100,
      repsAtMaxWeight: 5
    };

    renderWithTheme(
      <SetLogger {...defaultProps} previousSession={previousSession} />
    );

    expect(screen.getByText(/Marca anterior/i)).toBeInTheDocument();
    expect(screen.getByText('100 kg × 5 reps')).toBeInTheDocument();
  });

  it('submits logged set data when clicking the register button', async () => {
    const user = userEvent.setup();
    const handleLogSet = vi.fn().mockResolvedValue(undefined);

    renderWithTheme(
      <SetLogger
        {...defaultProps}
        setNumber={1}
        onLogSet={handleLogSet}
      />
    );

    const submitBtn = screen.getByRole('button', {
      name: /REGISTRAR SERIE #1/i
    });

    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleLogSet).toHaveBeenCalledTimes(1);
      expect(handleLogSet).toHaveBeenCalledWith(
        expect.objectContaining({
          weightKg: expect.any(Number),
          reps: expect.any(Number),
          rpe: 8.0,
          feeling: 'good'
        })
      );
    });
  });

  it('disables submit button and shows loading state while submission is pending', async () => {
    const user = userEvent.setup();
    let resolvePromise: () => void = () => {};
    const pendingPromise = new Promise<void>((res) => {
      resolvePromise = res;
    });

    const handleLogSet = vi.fn().mockReturnValue(pendingPromise);

    renderWithTheme(
      <SetLogger
        {...defaultProps}
        setNumber={3}
        onLogSet={handleLogSet}
      />
    );

    const submitBtn = screen.getByRole('button', {
      name: /REGISTRAR SERIE #3/i
    });

    await user.click(submitBtn);

    // Button should be disabled during submission
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });

    // Resolve the submission
    resolvePromise();

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
  });
});
