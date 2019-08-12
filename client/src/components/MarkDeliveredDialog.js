import { MuiThemeProvider, withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CANCEL_MARK_DELIVERED, markDelivered } from '../reducers/books';
import themes from '../themes';
import Button from './Button';

const styles = theme => ({
  actions: {
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ books }) => ({
  confirmingDelivery: books.markDelivered
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelMarkDelivered: () => dispatch => dispatch({ type: CANCEL_MARK_DELIVERED }),
      markDelivered
    }, dispatch
  );


class MarkDeliveredDialog extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <Dialog
        open={this.props.confirmingDelivery}
        onClose={this.props.cancelMarkDelivered}>
        <MuiThemeProvider theme={themes.narrow}>
          <DialogTitle>
            Confirm all these books delivered?
          </DialogTitle>
          {!this.props.admin &&
          <DialogContent>
            <DialogContentText>
              If you mark all these books delivered for this person, they will be removed from the list.
            </DialogContentText>
          </DialogContent>
          }
          <DialogActions className={this.classes.actions}>
            <Button onClick={this.props.cancelMarkDelivered}>
              Never mind
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.markDelivered(this.props.confirmingDelivery)}>
              Yes, do that
            </Button>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MarkDeliveredDialog));
