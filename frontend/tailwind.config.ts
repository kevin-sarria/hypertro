import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        brand: {
          neon: '#39FF14',
          neonHover: '#32e012',
          neonGlow: 'rgba(57, 255, 20, 0.25)'
        }
      }
    }
  },
  plugins: []
};

export default config;
