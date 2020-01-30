import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import coverUrl from '../../cover';
import { deselectBook } from '../../reducers/books';
import Button from '../Button';
import BookField from './BookField';
import ReserveButton from './ReserveButton';
import ReservedBanner from './ReservedBanner';

const EDGE_XS = 180;
const EDGE = 270;

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: '0!important'
  },
  dialogPaper: {
    [theme.breakpoints.up('xs')]: {
      marginTop: 0,
      marginBottom: 0
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(8)
    }
  },
  card: {
    display: 'flex'
  },
  coverContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  },
  cover: {
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      maxHeight: EDGE_XS,
      maxWidth: EDGE_XS
    },
    [theme.breakpoints.up('sm')]: {
      height: EDGE,
      width: EDGE
    }
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  content: {
    flex: '1 0 auto',
    paddingBottom: 0
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem'
    }
  },
  author: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.9rem'
    },
    color: theme.palette.text.secondary
  }
}));

function Cover(props) {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('xs'));
  const { book, classes } = props;
  if (book && book.cover) {

    const { cover, title, width: coverWidth, height: coverHeight } = book;

    const longerEdge = Math.max(coverWidth, coverHeight);
    const shorterEdge = Math.min(coverWidth, coverHeight);
    const scale = EDGE / longerEdge;
    const shorterScaled = scale * shorterEdge;
    const diff = parseInt(`${(EDGE - shorterScaled) / 2}`) + 1;
    const margin = coverWidth < coverHeight ? { marginLeft: -diff } : { marginTop: -diff };
    const style = matchesXs ? {} : margin;

    return (
      <Grid className={classes.coverContainer} item xs={12} sm={6}>
        <CardMedia
          component="img"
          className={classes.cover}
          srcSet={`${coverUrl(cover, 270)}, ${coverUrl(cover, 540)} 2x, ${coverUrl(cover, 810)} 3x`}
          src={coverUrl(cover, 810)}
          title={title}
          style={style}/>
      </Grid>
    );
  }
  return null;
}

export default function BookDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editing = useSelector(state => state.books.editing);
  return (
    <Dialog
      open={!!props.book}
      onClose={() => dispatch(deselectBook())}
      maxWidth="sm"
      classes={{ paper: classes.dialogPaper }}>
      <DialogContent className={classes.dialog}>
        <Card className={classes.card}>
          <Grid container>
            <Cover book={props.book} classes={classes}/>
            <Grid item xs={12} sm={6}>
              <div className={classes.metadata}>
                <CardContent className={classes.content}>
                  <BookField field="title" book={props.book} editing={editing === 'title'}>
                    <Typography className={classes.title} variant="h5" component="h5">
                      {props.book ? props.book.title : ''}
                    </Typography>
                  </BookField>
                  <BookField field="author" book={props.book} editing={editing === 'author'}>
                    <Typography className={classes.author} variant="subtitle1" color="textSecondary">
                      {props.book ? props.book.author : ''}
                    </Typography>
                  </BookField>
                  <ReservedBanner
                    isbn={props.book && props.book.isbn}
                    reserver={props.book ? props.book.reserverName : null}/>
                </CardContent>
                <div className={classes.actionsContainer}>
                  <CardActions className={classes.actions}>
                    <Button onClick={() => dispatch(deselectBook())} data-testid="bookDialogCloseButton">
                      Close
                    </Button>
                    <ReserveButton book={props.book}/>
                  </CardActions>
                </div>
              </div>
            </Grid>
          </Grid>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
