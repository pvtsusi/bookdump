import Avatar from '@material-ui/core/Avatar';
import CardActionArea from '@material-ui/core/CardActionArea';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import ReservedIcon from '@material-ui/icons/HowToVote';
import StarIcon from '@material-ui/icons/Star';
import React from 'react';
import { useSelector } from 'react-redux';
import cover from '../../cover';
import themes from '../../themes';

const useStyles = makeStyles(theme => ({
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
}));

function BookIcon(props) {
  const { reservedClass, recommendedClass } = props;
  const reserver = props.book.reserverName === props.userName ? 'you' : props.book.reserverName;
  const reserved = `Reserved for ${reserver}`;
  if (props.book.reserverName) {
    return (
      <ListItemIcon>
        <Tooltip title={reserved} aria-label={reserved}>
          <ReservedIcon className={reservedClass} fontSize="large"/>
        </Tooltip>
      </ListItemIcon>
    );
  } else if (props.book.recommended) {
    return (
      <ListItemIcon>
        <Tooltip title="Recommended" aria-label="Recommended">
          <StarIcon className={recommendedClass} fontSize="large"/>
        </Tooltip>
      </ListItemIcon>
    );
  } else {
    return null;
  }
}

export default function Book(props) {
  const classes = useStyles();
  const userName = useSelector(state => state.session.user && state.session.user.name);
  return (
    <CardActionArea>
      <ListItem onClick={props.onSelect}>
        {
          props.book.cover &&
          <Paper square={true}>
            <ListItemAvatar classes={{ root: classes.avatarRoot }}>
              <Avatar
                className={classes.cover}
                src={cover(props.book.cover, 120)}
                srcSet={`${cover(props.book.cover, 40)}, ${cover(props.book.cover, 80)} 2x, ${cover(props.book.cover, 120)} 3x`}/>
            </ListItemAvatar>
          </Paper>
        }
        <MuiThemeProvider theme={themes.vollkorn}>
          <ListItemText
            inset
            classes={{ root: classes.listItemText, secondary: classes.secondary }}
            primary={props.book.title}
            secondary={props.book.author}/>
        </MuiThemeProvider>
        <BookIcon
          book={props.book}
          userName={userName}
          reservedClass={classes.reserved}
          recommendedClass={classes.recommended}/>
      </ListItem>
    </CardActionArea>
  );
}
