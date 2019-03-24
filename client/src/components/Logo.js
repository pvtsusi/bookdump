import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const books_1x = require('../images/books_1x.svg');
const books_2x = require('../images/books_2x.svg');

const styles = theme => ({
  root: {
    height: 50,
    paddingRight: theme.spacing.unit * 2
  },
});

function Logo(props) {
  const {classes} = props;

  return (
    <img className={classes.root} srcSet={`${books_1x}, ${books_2x} 2x`} src={books_1x} alt="" />
  );
}

Logo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Logo);


