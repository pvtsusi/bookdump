import { createMuiTheme } from '@material-ui/core/styles';
import 'typeface-pt-sans';
import 'typeface-pt-sans-narrow';
import 'typeface-vollkorn';

export default {
  normal: createMuiTheme({
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
