import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import 'typeface-pt-sans';
import 'typeface-pt-sans-narrow';
import 'typeface-vollkorn';

const breakpoints = {
  values: {
    xs: 0,
    sm: 568,
    md: 960,
    lg: 1280,
    xl: 1920
  }
};

export default {
  normal: createMuiTheme({
    breakpoints,
    typography: {
      useNextVariants: true,
      fontFamily: [
        'PT Sans',
        'Arial',
        'Helvetica',
        'sans-serif'
      ].join(',')
    }
  }),


  dark: createMuiTheme({
    breakpoints,
    palette: {
      type: 'dark',
      primary: {
        main: '#4f63ff',
      }
    },
    typography: {
      useNextVariants: true,
      fontFamily: [
        'PT Sans',
        'Arial',
        'Helvetica',
        'sans-serif'
      ].join(','),
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
      fontWeightBold: 800,
    }
  }),

  narrow: createMuiTheme({
    breakpoints,
    typography: {
      useNextVariants: true,
      fontFamily: [
        'PT Sans Narrow',
        'Arial',
        'Helvetica',
        'sans-serif'
      ].join(',')
    }
  }),

  vollkorn: createMuiTheme({
    breakpoints,
    typography: {
      useNextVariants: true,
      fontFamily: [
        'vollkorn',
        'Times',
        'Times New Roman',
        'Georgia',
        'serif'
      ].join(',')
    }
  })
};
