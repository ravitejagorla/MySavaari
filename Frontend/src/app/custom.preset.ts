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
  },

  components: {
    toast: {
      colorScheme: {
        light: {
          success: {
            background: '#ecfdf3',
            borderColor: '#abefc6',
            color: '#027a48',
            detailColor: '#027a48'
          },

          info: {
            background: '#eff8ff',
            borderColor: '#b2ddff',
            color: '#175cd3',
            detailColor: '#175cd3'
          },

          warn: {
            background: '#fffaeb',
            borderColor: '#fedf89',
            color: '#b54708',
            detailColor: '#b54708'
          },

          error: {
            background: '#fef3f2',
            borderColor: '#fecdca',
            color: '#b42318',
            detailColor: '#b42318'
          }
        },

        dark: {
          success: {
            background: '#052e16',
            borderColor: '#166534',
            color: '#86efac',
            detailColor: '#bbf7d0'
          },

          info: {
            background: '#172554',
            borderColor: '#1d4ed8',
            color: '#93c5fd',
            detailColor: '#bfdbfe'
          },

          warn: {
            background: '#451a03',
            borderColor: '#92400e',
            color: '#fcd34d',
            detailColor: '#fde68a'
          },

          error: {
            background: '#450a0a',
            borderColor: '#991b1b',
            color: '#fca5a5',
            detailColor: '#fecaca'
          }
        }
      }
    }
  }
});