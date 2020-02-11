import MaterialUiButton from '@material-ui/core/Button';
import React from 'react';

function Button(props) {
  return (
    <MaterialUiButton
      type={props.type || 'button'}
      disableRipple={props.disableRipple}
      onClick={props.onClick}
      color={props.color || 'primary'}
      fullWidth={props.fullWidth}
      variant={props.variant || 'text'}>
      {props.children}
    </MaterialUiButton>
  );
}

export default Button;
