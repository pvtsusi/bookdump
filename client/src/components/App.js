import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Books from './Books';

import * as Actions from '../actions';
import openSocket from 'socket.io-client';

import { kickback } from '../actions';

import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-vollkorn';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TopBar from './TopBar';
import AdminLogin from "./AdminLogin";
import ModalProgress from './ModalProgress';


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

const theme = createMuiTheme({
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
});

const mapStateToProps = ({ progress }) => ({
  loading: progress.loading
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = openSocket('/');
    this.socket.on(Actions.KICKBACK, data => {
      console.log(data);
      kickback(data);
    });
    this.classes = props.classes;
  }

  componentDidMount() {
    // Accessible because we 'connected'
    this.props.doPoke({ socket: this.socket });
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <ModalProgress show={this.props.loading}/>
          <div className={this.classes.root}>
            <TopBar/>
            <Grid container justify="center">
              <Grid container spacing={24} alignItems="center" justify="center" className={this.classes.grid}>
                <Grid item xs={12} sm={10}>
                  <Paper className={this.classes.paper}>
                    <ConnectedRouter history={this.props.history} >
                      <Switch>
                        <Route exact path="/" component={Books} />
                        <Route exact path="/admin" component={AdminLogin} />
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

export default withStyles(styles)(connect(mapStateToProps, { doPoke: Actions.doPoke })(App));