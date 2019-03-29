import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
  cover: {
    borderRadius: 0
  }
});


const Book = props => {
  const book = props.book;

  return (
    <ListItem>
      {
        book.cover &&
        <Paper>
          <ListItemAvatar className={props.classes.cover}>
            <Avatar src={book.cover}/>
          </ListItemAvatar>
        </Paper>
      }
      <ListItemText inset primary={book.title} secondary={book.author} />
      {
        book.recommended &&
        <ListItemIcon>
          <StarIcon/>
        </ListItemIcon>
      }
    </ListItem>
  );
};

export default withStyles(styles)(Book);
