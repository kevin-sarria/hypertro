// Molecule: FormField

import React from 'react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';

export interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  isRequired,
  children
}) => {
  return (
    <FormControl isInvalid={Boolean(error)} isRequired={isRequired} mb={4}>
      <FormLabel fontSize="sm" fontWeight="700" color="zinc.300" mb={1.5}>
        {label}
      </FormLabel>
      {children}
      {error ? (
        <FormErrorMessage fontSize="xs" color="red.400" mt={1}>
          {error}
        </FormErrorMessage>
      ) : helperText ? (
        <FormHelperText fontSize="xs" color="zinc.500" mt={1}>
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};
