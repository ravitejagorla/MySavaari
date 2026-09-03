import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f2f7ff',
      100: '#ecf3ff',
      200: '#c2d6ff',
      300: '#9cb9ff',
      400: '#7592ff',
      500: '#465fff',
      600: '#3641f5',
      700: '#2a31d8',
      800: '#252dae',
      900: '#262e89',
      950: '#161950'
    },

    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}'
        },

        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.700}'
        }
      },

      dark: {
        primary: {
          color: '{primary.200}',
          contrastColor: '{primary.950}',
          hoverColor: '{primary.100}',
          activeColor: '{primary.300}'
        }
      }
    }
  }
});