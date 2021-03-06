import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelMarkDelivered, markDelivered } from '../../books';
import { Button } from '../../app';

const useStyles = makeStyles(theme => ({
  actions: {
    paddingRight: theme.spacing(2)
  }
}));

export default function MarkDeliveredDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const confirmingDelivery = useSelector(state => state.books.markDelivered);
  return (
    <Dialog
      open={!!confirmingDelivery}
      onClose={() => dispatch(cancelMarkDelivered)}>
      <DialogTitle>
        Confirm all these books delivered?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          If you mark all these books delivered for this person, they will be removed from the list.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={() => dispatch(cancelMarkDelivered())} data-testid="cancel-delivery-button">
          Never mind
        </Button>
        <Button
          variant="contained"
          color="secondary"
          data-testid="confirm-delivery-button"
          onClick={() => dispatch(markDelivered(confirmingDelivery))}>
          Yes, do that
        </Button>
      </DialogActions>
    </Dialog>
  );
}
