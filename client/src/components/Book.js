import React from 'react';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';
import ReservedIcon from '@material-ui/icons/HowToVote'
import PropTypes from "prop-types";
import CardActionArea from '@material-ui/core/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { connect } from 'react-redux';
import themes from '../themes';
import Zoom from '@material-ui/core/Zoom/Zoom';
import cover from '../cover';


const styles = theme => ({
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
  render () {
    const reserver = this.props.book.reserverName === this.props.userName ? 'you' : this.props.book.reserverName;
    const reserved = `Reserved for ${reserver}`;
    if (this.props.book.reserverName) {
      return (
        <Zoom in>
          <ListItemIcon>
            <MuiThemeProvider theme={themes.normal}>
              <Tooltip title={reserved} aria-label={reserved}>
                <ReservedIcon className={this.props.reservedClass} fontSize="large"/>
              </Tooltip>
            </MuiThemeProvider>
          </ListItemIcon>
        </Zoom>
      );
    } else if (this.props.book.recommended) {
      return (
        <ListItemIcon>
          <MuiThemeProvider theme={themes.normal}>
            <Tooltip title="Recommended" aria-label="Recommended">
              <StarIcon className={this.props.recommendedClass} fontSize="large"/>
            </Tooltip>
          </MuiThemeProvider>
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

  render () {
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
          <ListItemText inset primary={this.props.book.title} secondary={this.props.book.author}/>
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, () => ({}))(Book));
