import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from './Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {deselectBook} from "../reducers/books";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import BookField from './BookField';

const EDGE = 270;

const styles = theme => ({
  dialog: {
    padding: '0!important'
  },
  card: {
    display: 'flex',
  },
  cover: {
    objectFit: 'contain',
    height: EDGE,
    width: EDGE
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});

const mapStateToProps = ({ books }) => ({
  editing: books.editing
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deselectBook
    }, dispatch
  );

const Cover = props =>  {
  if (props.book && props.book.cover) {

    const { cover, title, width, height } = props.book;

    const longerEdge = Math.max(width, height);
    const shorterEdge = Math.min(width, height);
    const scale = EDGE / longerEdge;
    const shorterScaled = scale * shorterEdge;
    const diff = parseInt((EDGE - shorterScaled) / 2) + 1;
    const style = width < height ? {marginLeft: -diff} : {marginTop: -diff};

    return (
      <CardMedia component="img" className={props.classes.cover} image={cover} title={title} style={style}/>
    );
  }
  return null;
};


class BookDialog extends React.Component {

  render () {
    const { classes, book, editing } = this.props;
    return (
      <Dialog open={!!book} onClose={this.props.deselectBook}>
        <DialogContent className={classes.dialog}>
          <Card className={classes.card}>
            <Cover book={book} classes={classes} />
            <div className={classes.metadata}>
              <CardContent className={classes.content}>
                <BookField field="title" book={this.props.book} editing={editing === 'title'}>
                  <Typography gutterBottom variant="h5" component="h5">
                    {this.props.book ? this.props.book.title : ''}
                  </Typography>
                </BookField>
                <BookField field="author" book={this.props.book} editing={editing === 'author'}>
                  <Typography gutterBottom variant="subtitle1" color="textSecondary">
                    {this.props.book ? this.props.book.author : ''}
                  </Typography>
                </BookField>
              </CardContent>
              <CardActions className={classes.actions}>
                <Button onClick={this.props.deselectBook}>
                  Close
                </Button>
              </CardActions>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }
}

BookDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BookDialog));
