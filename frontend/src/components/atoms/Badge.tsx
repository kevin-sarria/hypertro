// Atom: Badge (Highlights PRs and status tags)

import React from 'react';
import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';

export interface BadgeProps extends ChakraBadgeProps {
  isPR?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ isPR, children, ...props }) => {
  if (isPR) {
    return (
      <ChakraBadge
        bg="#39FF14"
        color="black"
        px={2.5}
        py={1}
        borderRadius="full"
        fontSize="xs"
        fontWeight="800"
        letterSpacing="wider"
        boxShadow="0 0 10px rgba(57, 255, 20, 0.4)"
        {...props}
      >
        {children || 'RECORD PERSONAL'}
      </ChakraBadge>
    );
  }

  return (
    <ChakraBadge
      bg="zinc.800"
      color="zinc.300"
      px={2}
      py={0.5}
      borderRadius="md"
      fontSize="xs"
      fontWeight="600"
      {...props}
    >
      {children}
    </ChakraBadge>
  );
};
