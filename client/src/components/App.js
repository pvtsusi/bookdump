import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { ConnectedRouter } from 'connected-react-router';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import openSocket from 'socket.io-client';
import { SNACKBAR_ERROR, SNACKBAR_LOGGED_OUT } from '../reducers/snackbar';
import { isValidSession, SESSION_VALIDATED } from '../reducers/socket';
import { LOGGED_OUT, logout } from '../reducers/user';
import themes from '../themes';
import AdminView from './AdminView';
import Books from './Books';
import MessageSnackbar from './MessageSnackbar';
import ModalProgress from './ModalProgress';
import TooSlowSnackbar from './TooSlowSnackbar';
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
    padding: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ progress, session }) => ({
  loading: progress.loading,
  admin: session.authenticated && session.user && session.user.admin,
  userSha: session.user && session.user.sha
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      isValidSession,
      sessionValidated: () => dispatch({ type: SESSION_VALIDATED }),
      loggedOut: () => dispatch({ type: LOGGED_OUT }),
      dispatchActionFromServer: (action) => dispatch(action),
      logout: logout
    }, dispatch
  );

class App extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;

    this.socket = openSocket('/');

    this.socket.on('session_validated', data => {
      if (!data.valid) {
        this.props.logout(this.props.admin);
        this.props.loggedOut();
      }
      this.props.sessionValidated();
    });

    this.socket.on('dispatch', action => {
      if (!action.origin || !this.props.userSha || action.origin !== this.props.userSha) {
        this.props.dispatchActionFromServer(action);
      }
    });
  }

  componentDidMount() {
    setInterval(() => this.props.isValidSession({ socket: this.socket }), 5000);
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <MuiThemeProvider theme={themes.normal}>
          <ModalProgress show={this.props.loading}/>
          <MessageSnackbar snackbarKey={SNACKBAR_LOGGED_OUT}/>
          <MessageSnackbar snackbarKey={SNACKBAR_ERROR}/>
          <TooSlowSnackbar/>
          <div className={this.classes.root}>
            <TopBar/>
            <Grid container justify="center">
              <Grid container spacing={24} alignItems="center" justify="center" className={this.classes.grid}>
                <Grid item xs={12} sm={10}>
                  <Paper className={this.classes.paper}>
                    <ConnectedRouter history={this.props.history}>
                      <Switch>
                        <Route exact path="/" component={Books}/>
                        <Route exact path="/admin" component={AdminView}/>
                      </Switch>
                    </ConnectedRouter>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));