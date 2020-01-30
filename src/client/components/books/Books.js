import List from '@material-ui/core/List';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, selectBook } from '../../reducers/books';
import Progress from '../Progress';
import Book from './Book';
import BookDialog from './BookDialog';

const useStyles = makeStyles(theme => ({
  notification: {
    textAlign: 'center',
    fontWeight: 600
  },
  list: {
    paddingBottom: theme.spacing(5)
  }
}));

export default function Books() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.books);
  const selected = useSelector(state => state.books.selected);
  const error = useSelector(state => state.books.error);

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  if (error) {
    return (
      <Typography className={classes.notification}>
        Error: {error}
      </Typography>
    );
  }

  if (!books) {
    return (
      <Progress className={classes.notification}/>
    );
  }

  if (books.length === 0) {
    return (
      <Typography className={classes.notification}>
        No books
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <List className={classes.list}>
        {
          books.map(book => {
            return (
              <Book book={book} key={book.isbn} onSelect={() => dispatch(selectBook(book))}/>
            );
          })
        }
      </List>
      <BookDialog book={books.find(book => book.isbn === selected)}/>
    </React.Fragment>
  );
}
