import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBooks, selectBook } from '../reducers/books';
import Book from './Book';
import BookDialog from './BookDialog';
import Progress from './Progress';

const styles = theme => ({
  notification: {
    textAlign: 'center',
    fontWeight: 600
  },
  list: {
    paddingBottom: theme.spacing.unit * 5
  }
});

const mapStateToProps = ({ books }) => ({
  books: books.books,
  selected: books.selected,
  error: books.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBooks,
      selectBook
    }, dispatch
  );

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  componentWillMount() {
    this.props.getBooks();
  }

  render() {
    if (this.props.error) {
      return (
        <Typography className={this.classes.notification}>
          Error: {this.props.error}
        </Typography>
      );
    }

    if (!this.props.books) {
      return (
        <Progress className={this.classes.notification}/>
      );
    }

    if (this.props.books.length === 0) {
      return (
        <Typography className={this.classes.notification}>
          No books
        </Typography>
      );
    }

    return (
      <React.Fragment>
        <List className={this.classes.list}>
          {
            this.props.books.map(book => {
              return (
                <Book book={book} key={book.isbn} onSelect={() => this.props.selectBook(book)}/>
              );
            })
          }
        </List>
        <BookDialog book={this.props.books.find(book => book.isbn === this.props.selected)}/>
      </React.Fragment>
    );
  }
}

Books.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Books));
