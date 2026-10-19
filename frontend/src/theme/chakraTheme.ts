// Theme: Chakra UI Theme Configuration

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
};

export const chakraTheme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
  },
  colors: {
    brand: {
      neon: '#39FF14',
      neonHover: '#32e012',
      neonGlow: 'rgba(57, 255, 20, 0.25)',
      900: '#002900',
      800: '#005200',
      700: '#007a00',
      600: '#00a300',
      500: '#39FF14'
    },
    zinc: {
      950: '#09090b',
      900: '#18181b',
      800: '#27272a',
      700: '#3f3f46',
      600: '#52525b',
      500: '#71717a',
      400: '#a1a1aa',
      300: '#d4d4d8',
      200: '#e4e4e7',
      100: '#f4f4f5',
      50: '#fafafa'
    }
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#09090b',
        color: '#f4f4f5'
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
        minHeight: '56px',
        fontSize: 'md',
        transition: 'all 0.15s ease-in-out'
      },
      variants: {
        solid: {
          bg: '#39FF14',
          color: '#000000',
          _hover: {
            bg: '#32e012',
            boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)'
          },
          _active: {
            bg: '#2bc410',
            transform: 'scale(0.98)'
          }
        },
        secondary: {
          bg: 'zinc.900',
          color: 'zinc.100',
          borderWidth: '1px',
          borderColor: 'zinc.800',
          _hover: {
            bg: 'zinc.800',
            borderColor: 'zinc.700'
          }
        },
        ghost: {
          color: 'zinc.300',
          _hover: {
            bg: 'zinc.900',
            color: '#39FF14'
          }
        }
      },
      defaultProps: {
        variant: 'solid'
      }
    },
    Input: {
      defaultProps: {
        size: 'lg'
      },
      sizes: {
        lg: {
          field: {
            minHeight: '56px',
            fontSize: 'lg',
            borderRadius: 'lg'
          }
        }
      },
      variants: {
        outline: {
          field: {
            bg: 'zinc.900',
            borderColor: 'zinc.800',
            color: 'white',
            _hover: {
              borderColor: 'zinc.700'
            },
            _focus: {
              borderColor: '#39FF14',
              boxShadow: '0 0 0 1px #39FF14'
            }
          }
        }
      }
    }
  }
});
