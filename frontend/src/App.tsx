// App Root Component

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { chakraTheme } from './theme/chakraTheme';
import { AppRouter } from './routes/AppRouter';
import { useAuth } from './application/hooks/useAuth';

export const AppContent: React.FC = () => {
  // Inicialización de autenticación
  useAuth();

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <AppContent />
    </ChakraProvider>
  );
};

export default App;
