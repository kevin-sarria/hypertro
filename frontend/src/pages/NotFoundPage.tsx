// Page: NotFoundPage (default export for React.lazy)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { Button } from '../components/atoms/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box minHeight="100vh" bg="#09090b" display="flex" alignItems="center" justifyContent="center" p={4}>
      <VStack spacing={4} textAlign="center" maxW="400px">
        <Text fontSize="6xl" fontWeight="900" color="#39FF14">
          404
        </Text>
        <Heading as="h1" fontSize="2xl" fontWeight="900" color="white">
          Página no encontrada
        </Heading>
        <Text fontSize="sm" color="zinc.400">
          La ruta a la que intentas acceder no existe o fue movida.
        </Text>
        <Button onClick={() => navigate('/')} isFullWidth mt={2}>
          Volver al Inicio
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFoundPage;
