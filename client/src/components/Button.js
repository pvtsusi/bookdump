import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MaterialUiButton from '@material-ui/core/Button';
import 'typeface-pt-sans';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: [
      'PT Sans',
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(',')
  }
});

function Button(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <MaterialUiButton
        onClick={props.onClick}
        color={props.color || 'primary'}
        variant={props.variant || 'text'}>
        {props.children}
      </MaterialUiButton>
    </MuiThemeProvider>
  );
}

export default Button;
