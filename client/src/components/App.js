import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Books from './Books';
import {bindActionCreators} from 'redux';

import openSocket from 'socket.io-client';

import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TopBar from './TopBar';
import AdminView from './AdminView';
import ModalProgress from './ModalProgress';
import { isValidSession } from '../reducers/socket';
import LoggedOutSnackbar from './LoggedOutSnackbar';
import themes from '../themes';
import {logout} from '../reducers/user';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grid: {
    marginTop: 70,
    maxWidth: 800,
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 40px)'
    }
  },
  paper: {
    padding: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ progress, session }) => ({
  loading: progress.loading,
  admin: session.authenticated && session.user && session.user.admin,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      isValidSession,
      sessionValidated: () => dispatch({ type: 'SESSION_VALIDATED'}),
      loggedOut: () => dispatch({ type: 'LOGGED_OUT' }),
      logout: logout
    }, dispatch
  );

class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = openSocket('/');
    this.socket.on('session_validated', data => {
      if (!data.valid) {
        this.props.logout(this.props.admin);
        this.props.loggedOut();
      }
      this.props.sessionValidated();
    });
    this.classes = props.classes;
  }

  componentDidMount() {
    setInterval(() => this.props.isValidSession({socket: this.socket}), 5000);
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={themes.vollkorn}>
          <ModalProgress show={this.props.loading}/>
          <LoggedOutSnackbar/>
          <div className={this.classes.root}>
            <TopBar/>
            <Grid container justify="center">
              <Grid container spacing={24} alignItems="center" justify="center" className={this.classes.grid}>
                <Grid item xs={12} sm={10}>
                  <Paper className={this.classes.paper}>
                    <ConnectedRouter history={this.props.history} >
                      <Switch>
                        <Route exact path="/" component={Books} />
                        <Route exact path="/admin" component={AdminView} />
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