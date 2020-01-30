import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import withStyles from '@material-ui/core/styles/withStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { SNACKBAR_ERROR, SNACKBAR_LOGGED_OUT } from '../reducers/snackbar';
import themes from '../themes';
import TooSlowSnackbar from './books/TooSlowSnackbar';
import MessageSnackbar from './MessageSnackbar';
import ModalProgress from './ModalProgress';
import TopBar from './TopBar';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grid: {
    marginTop: 70,
    maxWidth: 800,
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 40px)'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: 2,
      marginRight: 2
    }
  },
  paper: {
    padding: theme.spacing(2)
  }
});

function App(props) {
  const classes = props.classes;

  const loading = useSelector(state => state.progress.loading);

  const prefersDarkMode = props.mode === 'dark' || useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <MuiThemeProvider theme={prefersDarkMode ? themes.dark : themes.normal}>
      <CssBaseline/>
      <ModalProgress show={loading}/>
      <MessageSnackbar snackbarKey={SNACKBAR_LOGGED_OUT}/>
      <MessageSnackbar snackbarKey={SNACKBAR_ERROR}/>
      <TooSlowSnackbar/>
      <div className={classes.root}>
        <TopBar/>
        {props.herp}
        <Grid container justify="center">
          <Grid container spacing={2} alignItems="center" justify="center" className={classes.grid}>
            <Grid item xs={12} sm={10}>
              <Paper className={classes.paper}>
                {renderRoutes(props.route.routes)}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}

export default withStyles(styles)(App);