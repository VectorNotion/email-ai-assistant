import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system', // Change this to 'dark' if you want the dark mode to be the default
  useSystemColorMode: true, // Change this to true if you want to use the system color mode
};

export default extendTheme({
  config,
  colors: {
    // dark black
    brand: {
      50: '#f0f0f0',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#171923',
      600: '#595959',
      700: '#404040',
      800: '#262626',
      900: '#0d0d0d',
    },
  },
  components: {
    Text: {
      baseStyle: {
        // color mode light and dark for Text component
        light: {
          color: 'gray.800',
        },
        dark: {
          color: 'gray.300',
        },
      },
    },
  },
});
