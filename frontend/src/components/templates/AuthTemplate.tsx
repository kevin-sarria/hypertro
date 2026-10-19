// Template: AuthTemplate

import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

export interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ title, subtitle, children }) => {
  return (
    <Box minHeight="100vh" bg="#09090b" display="flex" alignItems="center" justifyContent="center" py={8} px={4}>
      <Container maxW="460px" p={0}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading
              as="h1"
              fontSize="3xl"
              fontWeight="900"
              color="white"
              letterSpacing="tight"
              mb={2}
            >
              HYPER<Text as="span" color="#39FF14">TRO</Text>
            </Heading>
            <Heading as="h2" fontSize="xl" fontWeight="700" color="zinc.200" mb={1}>
              {title}
            </Heading>
            {subtitle && (
              <Text fontSize="sm" color="zinc.400">
                {subtitle}
              </Text>
            )}
          </Box>

          <Box
            bg="zinc.900"
            borderWidth="1px"
            borderColor="zinc.800"
            borderRadius="2xl"
            p={{ base: 6, sm: 8 }}
            boxShadow="0 10px 30px rgba(0, 0, 0, 0.5)"
          >
            {children}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
