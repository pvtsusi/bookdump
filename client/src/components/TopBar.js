import React from 'react';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Logo from './Logo';
import 'typeface-pt-sans-narrow';
import Button from './Button';
import { connect } from 'react-redux';
import { logout } from '../actions';
import { bindActionCreators } from 'redux';
import themes from '../themes';


const styles = {
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
};

const mapStateToProps = ({ session }) => ({
  signedIn: session.user && session.user.name
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
      logout
    }, dispatch);

class TopBar extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <AppBar color="default">
          <Toolbar>
            <Logo/>
            <MuiThemeProvider theme={themes.narrow}>
              <Typography className={classes.title} variant="h4" color="inherit">
                Bookdump
              </Typography>
            </MuiThemeProvider>
            {this.props.signedIn &&
            <Button onClick={this.props.logout}>
              Sign out
            </Button>
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TopBar));