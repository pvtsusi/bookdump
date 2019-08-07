import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import themes from '../themes';
import Typography from '@material-ui/core/Typography';


const books_1x = require('../images/books_1x.svg');
const books_2x = require('../images/books_2x.svg');

const rootStyle = {
  display: 'flex',
  flexGrow: 1
};

const styles = theme => ({
  root: rootStyle,
  anchor: {
    ...rootStyle,
    cursor: 'pointer'
  },
  image: {
    height: 50,
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ router }) => ({
  path: router.location.pathname
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    goHome: () => () => dispatch(push('/'))
  }, dispatch);

class Logo extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={this.props.path !== '/' ? classes.anchor : classes.root}
           onClick={this.props.path !== '/' ? this.props.goHome : () => {}}>
        <img className={classes.image}
             srcSet={`${books_1x}, ${books_2x} 2x`}
             src={books_1x}
             alt=""/>
        <MuiThemeProvider theme={themes.narrow}>
          <Typography className={classes.title} variant="h4" color="inherit">
            Bookdump
          </Typography>
        </MuiThemeProvider>
      </div>
    );
  }
}

Logo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Logo));



