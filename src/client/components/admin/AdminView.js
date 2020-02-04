import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONFIRM_MARK_DELIVERED, declineBook, getBooks } from '../../reducers/books';
import AdminLogin from './AdminLogin';
import MarkDeliveredDialog from './MarkDeliveredDialog';

export default function AdminView() {
  const dispatch = useDispatch();
  const admin = useSelector(state => state.session.authenticated && state.session.user && state.session.user.admin);
  const books = useSelector(state => state.books.booksByReserver);
  const error = useSelector(state => state.books.error);
  const [declined, setDeclined] = useState({});

  const decline = useCallback(book => {
    dispatch(declineBook(book));
    setDeclined({ ...declined, [book.isbn]: true });
  }, [dispatch, declined]);

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch, admin]);

  if (!admin) {
    return (
      <AdminLogin/>
    );
  }

  if (error) {
    return (
      <Typography>
        Error: {error}
      </Typography>
    );
  }

  if (books && Object.keys(books).length === 0) {
    return (
      <Typography>
        No reserved books
      </Typography>
    );
  }

  if (books) {
    return (
      <React.Fragment>
        <MarkDeliveredDialog/>
        <List subheader={<li/>} data-testid="reserversList">
          {
            Object.keys(books).map(reserver => {
              const reserverName = books[reserver][0].reserverName;
              return (
                <li key={reserver} data-key={reserver}>
                  <ul style={{ listStyle: 'none' }}>
                    <ListSubheader>
                      <Typography variant="h6">
                        {reserverName}
                        <Tooltip title="Mark all delivered" aria-label="Mark all delivered">
                          <IconButton onClick={() => dispatch({ type: CONFIRM_MARK_DELIVERED, reserver })}
                                      color="primary">
                            <DoneIcon/>
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </ListSubheader>
                    {
                      books[reserver].filter(book => !declined[book.isbn]).map(book => (
                        <ListItem key={book.isbn} data-key={book.isbn}>
                          <ListItemText inset primary={book.title} secondary={book.author}/>
                          <ListItemSecondaryAction>
                            <Tooltip title="Cancel reservation" aria-label="Cancel reservation">
                              <IconButton onClick={() => decline(book)} color="secondary">
                                <CloseIcon/>
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    }
                  </ul>
                </li>
              );
            })
          }
        </List>
      </React.Fragment>
    );
  }
  return null;
}
