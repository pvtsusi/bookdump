import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import themes from '../../themes';


const books_1x = require('../../images/books_1x.svg').default;
const books_2x = require('../../images/books_2x.svg').default;

const rootStyle = {
  display: 'flex',
  flexGrow: 1
};

const useStyles = makeStyles(theme => ({
  root: rootStyle,
  anchor: {
    ...rootStyle,
    cursor: 'pointer',
    color: theme.palette.text.primary,
    textDecoration: 'none'
  },
  image: {
    height: 50,
    paddingRight: theme.spacing(2)
  }
}));

function LogoContent() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <img className={classes.image}
           srcSet={`${books_1x}, ${books_2x} 2x`}
           src={books_1x}
           alt=""/>
      <MuiThemeProvider theme={themes.narrow}>
        <Typography className={classes.title} variant="h4" color="inherit">
          Bookdump
        </Typography>
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default function Logo() {
  const classes = useStyles();
  const location = useLocation();
  if (location.pathname === '/') {
    return (
      <div className={classes.root}>
        <LogoContent/>
      </div>
    );
  } else {
    return (
      <Link to="/" className={classes.anchor}>
        <LogoContent/>
      </Link>
    );
  }
}



