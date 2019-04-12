import React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import MaterialUiButton from '@material-ui/core/Button';
import themes from '../themes';

function Button(props) {
  return (
    <MuiThemeProvider theme={themes.normal}>
      <MaterialUiButton
        disableRipple={props.disableRipple}
        onClick={props.onClick}
        color={props.color || 'primary'}
        mini={props.mini}
        fullWidth={props.fullWidth}
        variant={props.variant || 'text'}>
        {props.children}
      </MaterialUiButton>
    </MuiThemeProvider>
  );
}

export default Button;
