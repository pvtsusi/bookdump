import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';


const Book = props => {
  const book = props.book;

  return (
    <ListItem>
      {
        book.recommended &&
        <ListItemIcon>
          <StarIcon/>
        </ListItemIcon>
      }
      <ListItemText inset primary={book.title} secondary={book.author} />
    </ListItem>
  );
};

export default Book;
