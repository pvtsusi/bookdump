import { createMuiTheme } from '@material-ui/core/styles';
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
}
