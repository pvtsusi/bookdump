import Avatar from '@material-ui/core/Avatar';
import CardActionArea from '@material-ui/core/CardActionArea';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import ReservedIcon from '@material-ui/icons/HowToVote';
import StarIcon from '@material-ui/icons/Star';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import cover from '../cover';
import themes from '../themes';

const styles = () => ({
  cover: {
    borderRadius: 0
  },
  reserved: {
    color: 'green'
  },
  recommended: {
    color: 'gold'
  }
});

const mapStateToProps = ({ session }) => ({
  userName: session.user && session.user.name
});

class BookIcon extends React.Component {
  render() {
    const { reservedClass, recommendedClass } = this.props;
    const reserver = this.props.book.reserverName === this.props.userName ? 'you' : this.props.book.reserverName;
    const reserved = `Reserved for ${reserver}`;
    if (this.props.book.reserverName) {
      return (
        <ListItemIcon>
          <Tooltip title={reserved} aria-label={reserved}>
            <ReservedIcon className={reservedClass} fontSize="large"/>
          </Tooltip>
        </ListItemIcon>
      );
    } else if (this.props.book.recommended) {
      return (
        <ListItemIcon>
          <Tooltip title="Recommended" aria-label="Recommended">
            <StarIcon className={recommendedClass} fontSize="large"/>
          </Tooltip>
        </ListItemIcon>
      );
    }
    return null;
  }
}

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.onSelect = props.onSelect;
  }

  render() {
    return (
      <CardActionArea>
        <ListItem onClick={this.onSelect}>
          {
            this.props.book.cover &&
            <Paper>
              <ListItemAvatar className={this.classes.cover}>
                <Avatar srcSet={`${cover(this.props.book.cover, 40)}, ${cover(this.props.book.cover, 80)} 2x`}/>
              </ListItemAvatar>
            </Paper>
          }
          <MuiThemeProvider theme={themes.vollkorn}>
            <ListItemText inset primary={this.props.book.title} secondary={this.props.book.author}/>
          </MuiThemeProvider>
          <BookIcon
            book={this.props.book}
            userName={this.props.userName}
            reservedClass={this.classes.reserved}
            recommendedClass={this.classes.recommended}/>
        </ListItem>
      </CardActionArea>
    );
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, () => ({}))(Book));
