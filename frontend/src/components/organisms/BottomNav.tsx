// Organism: BottomNav (Mobile navigation bar in thumb zone)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex, Text, VStack } from '@chakra-ui/react';
import { useAuthStore } from '../../application/stores/authStore';

export const BottomNav: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { label: 'Inicio', path: '/', icon: '⚡' },
    { label: 'Entrenar', path: '/workout', icon: '🏋️' },
    { label: 'Nutrición', path: '/nutrition', icon: '🥗' }
  ];

  if (user?.role === 'coach' || user?.role === 'admin') {
    navItems.push({ label: 'Squads', path: '/coach', icon: '👥' });
  }

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin', path: '/admin', icon: '⚙️' });
  }

  return (
    <Flex
      as="nav"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      height="64px"
      bg="#09090b"
      borderTopWidth="1px"
      borderColor="zinc.800"
      justify="space-around"
      align="center"
      zIndex={90}
      maxW="600px"
      mx="auto"
      px={2}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#39FF14' : '#a1a1aa',
            flex: 1,
            display: 'flex',
            justifyContent: 'center'
          })}
        >
          {({ isActive }) => (
            <VStack spacing={0.5} align="center">
              <Text fontSize="lg" lineHeight="1">
                {item.icon}
              </Text>
              <Text
                fontSize="2xs"
                fontWeight={isActive ? '800' : '600'}
                color={isActive ? '#39FF14' : 'zinc.400'}
              >
                {item.label}
              </Text>
            </VStack>
          )}
        </NavLink>
      ))}
    </Flex>
  );
};
