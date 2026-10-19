// Template: AppShellTemplate (Mobile-first app wrapper with fixed BottomNav)

import React from 'react';
import { Box, Flex, Text, HStack } from '@chakra-ui/react';
import { BottomNav } from '../organisms/BottomNav';
import { useAuthStore } from '../../application/stores/authStore';

export interface AppShellTemplateProps {
  children: React.ReactNode;
  headerTitle?: string;
  rightAction?: React.ReactNode;
}

export const AppShellTemplate: React.FC<AppShellTemplateProps> = ({
  children,
  headerTitle = 'Hypertro',
  rightAction
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Box minHeight="100vh" bg="#09090b" color="zinc.100">
      {/* Top Mobile Bar */}
      <Box
        position="sticky"
        top="0"
        zIndex={80}
        bg="rgba(9, 9, 11, 0.9)"
        backdropFilter="blur(10px)"
        borderBottomWidth="1px"
        borderColor="zinc.800"
        maxW="600px"
        mx="auto"
      >
        <Flex justify="space-between" align="center" px={4} height="56px">
          <Text fontSize="lg" fontWeight="900" letterSpacing="tight">
            {headerTitle === 'Hypertro' ? (
              <>
                HYPER<Text as="span" color="#39FF14">TRO</Text>
              </>
            ) : (
              headerTitle
            )}
          </Text>

          <HStack spacing={2}>
            {rightAction}
            {user && (
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                bg="zinc.800"
                borderWidth="1px"
                borderColor="zinc.700"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
                color="#39FF14"
              >
                {user.firstName ? user.firstName[0]?.toUpperCase() : user.email[0]?.toUpperCase()}
              </Box>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Main Content Area: Padding bottom to clear BottomNav */}
      <Box maxW="600px" mx="auto" px={4} pt={4} pb="80px">
        {children}
      </Box>

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav />
    </Box>
  );
};
