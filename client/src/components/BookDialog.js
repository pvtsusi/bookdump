import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from './Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import {bindActionCreators} from "redux";
import {deselectBook} from "../reducers/books";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import BookField from './BookField';
import ReservedBanner from './ReservedBanner';
import ReserveButton from './ReserveButton';
import Grid from '@material-ui/core/Grid/Grid';
import withWidth from '@material-ui/core/withWidth';

const EDGE_XS = 180;
const EDGE = 270;

const breakpoints = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 568,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});


const styles = theme => ({
  dialog: {
    padding: '0!important'
  },
  paper: {

  },
  card: {
    display: 'flex',
  },
  coverContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  },
  cover: {
    objectFit: 'contain',
    [theme.breakpoints.down('xs')]: {
      maxHeight: EDGE_XS,
      maxWidth: EDGE_XS
    },
    [theme.breakpoints.up('xs')]: {
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
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem'
    }
  },
  author: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.9rem'
    }
  }
});

const mapStateToProps = ({ books }) => ({
  editing: books.editing
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deselectBook,
    }, dispatch
  );

const Cover = withWidth()(props =>  {
  if (props.book && props.book.cover) {

    const { cover, title, width: coverWidth, height: coverHeight } = props.book;

    const longerEdge = Math.max(coverWidth, coverHeight);
    const shorterEdge = Math.min(coverWidth, coverHeight);
    const scale = EDGE / longerEdge;
    const shorterScaled = scale * shorterEdge;
    const diff = parseInt((EDGE - shorterScaled) / 2) + 1;
    const margin = coverWidth < coverHeight ? {marginLeft: -diff} : {marginTop: -diff};
    const style = props.width === 'xs' ? {} : margin;

    return (
      <Grid className={props.classes.coverContainer} item xs={12} sm={6}>
        <CardMedia component="img" className={props.classes.cover} image={cover} title={title} style={style}/>
      </Grid>
    );
  }
  return null;
});

class BookDialog extends React.Component {

  render () {
    const { classes, editing } = this.props;
    return (
      <MuiThemeProvider theme={breakpoints}>
      <Dialog open={!!this.props.book} onClose={this.props.deselectBook} maxWidth="sm" classes={{paper: classes.paper}}>
        <DialogContent className={classes.dialog}>
          <Card className={classes.card}>
            <Grid container>
              <Cover book={this.props.book} classes={classes} />
              <Grid item xs={12} sm={6}>
                <div className={classes.metadata}>
                  <CardContent className={classes.content}>
                    <BookField field="title" book={this.props.book} editing={editing === 'title'}>
                      <Typography className={classes.title} variant="h5" component="h5">
                        {this.props.book ? this.props.book.title : ''}
                      </Typography>
                    </BookField>
                    <BookField field="author" book={this.props.book} editing={editing === 'author'}>
                      <Typography className={classes.author} variant="subtitle1" color="textSecondary">
                        {this.props.book ? this.props.book.author : ''}
                      </Typography>
                    </BookField>
                    <ReservedBanner reserver={this.props.book ? this.props.book.reserverName : null}/>
                  </CardContent>
                  <div className={classes.actionsContainer}>
                    <CardActions className={classes.actions}>
                      <Button onClick={this.props.deselectBook}>
                        Close
                      </Button>
                      <ReserveButton book={this.props.book}/>
                    </CardActions>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Card>
        </DialogContent>
      </Dialog>
      </MuiThemeProvider>
    );
  }
}

BookDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BookDialog));
