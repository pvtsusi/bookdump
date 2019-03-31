import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';
import PropTypes from "prop-types";

const styles = theme => ({
  cover: {
    borderRadius: 0
  }
});

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.book = props.book;
    this.classes = props.classes;
    this.onSelect = props.onSelect;
  }

  render () {
    return (
      <ListItem onClick={this.onSelect}>
        {
          this.book.cover &&
          <Paper>
            <ListItemAvatar className={this.classes.cover}>
              <Avatar src={this.book.cover}/>
            </ListItemAvatar>
          </Paper>
        }
        <ListItemText inset primary={this.book.title} secondary={this.book.author}/>
        {
          this.book.recommended &&
          <ListItemIcon>
            <StarIcon/>
          </ListItemIcon>
        }
      </ListItem>
    );
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Book);
