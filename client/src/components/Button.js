import React from 'react';

import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MaterialUiButton from '@material-ui/core/Button';
import 'typeface-pt-sans-narrow';
import CardActions from "@material-ui/core/CardActions/CardActions";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: [
      'PT Sans Narrow',
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(',')
  }
});

function Button(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <MaterialUiButton onClick={props.onClick} color="primary">
        {props.children}
      </MaterialUiButton>
    </MuiThemeProvider>
  );
};

Button.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Button;
