import CardActionArea from '@material-ui/core/CardActionArea';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField/TextField';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editBook, updateBook } from '../../reducers/books';
import themes from '../../themes';

export default function BookField(props) {
  const dispatch = useDispatch();
  const admin = useSelector(state => state.session.authenticated && state.session.user && state.session.user.admin);
  const [editedValue, setEditedValue] = useState(props.book ? props.book[props.field] : '');
  const onSubmit = useCallback(event => {
    event.preventDefault();
    dispatch(updateBook(props.book, props.field, editedValue));
  }, [dispatch, props.book, props.field, editedValue]);

  if (props.editing) {
    return (
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <TextField
          fullWidth
          autoFocus
          onChange={(event) => setEditedValue(event.target.value)}
          id="title-input"
          helperText={props.book ? props.book[props.field] : ''}
        />
        <input type="submit" style={{ display: 'none' }}/>
      </form>
    );
  } else if (admin) {
    return (
      <CardActionArea onClick={() => dispatch(editBook(props.field))}>
        {props.children}
      </CardActionArea>
    );
  }
  return (
    <MuiThemeProvider theme={themes.vollkorn}>
      {props.children}
    </MuiThemeProvider>
  );
}
