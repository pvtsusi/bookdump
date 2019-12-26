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
import cover from '../../cover.mjs';
import themes from '../../themes';

const styles = theme => ({
  cover: {
    borderRadius: 0
  },
  secondary: {
    color: theme.palette.text.secondary
  },
  reserved: {
    color: 'green'
  },
  recommended: {
    color: 'gold'
  },
  avatarRoot: {
    minWidth: 0
  },
  listItemText: {
    paddingLeft: theme.spacing(2)
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
            <Paper square={true}>
              <ListItemAvatar classes={{ root: this.classes.avatarRoot }}>
                <Avatar
                  className={this.classes.cover}
                  src={cover(this.props.book.cover, 120)}
                  srcSet={`${cover(this.props.book.cover, 40)}, ${cover(this.props.book.cover, 80)} 2x, ${cover(this.props.book.cover, 120)} 3x`}/>
              </ListItemAvatar>
            </Paper>
          }
          <MuiThemeProvider theme={themes.vollkorn}>
            <ListItemText
              inset
              classes={{ root: this.classes.listItemText, secondary: this.classes.secondary }}
              primary={this.props.book.title}
              secondary={this.props.book.author}/>
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

const styled = withStyles(styles)(Book);
export { styled as Book };
export default connect(mapStateToProps, () => ({}))(styled);
