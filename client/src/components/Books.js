import React from 'react';
import { connect } from 'react-redux';
import Book from './Book';
import { getBooks } from '../reducers/books';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Progress from './Progress';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

const styles = theme => ({
  notification: {
    textAlign: 'center',
    fontWeight: 600,
  }
});

const mapStateToProps = ({ books }) => ({
  books: books.books
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBooks
    }, dispatch
  );

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  componentWillMount () {
    this.props.getBooks();
  }

  render () {
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
      <List>
        {
          this.props.books.map(book => {
            return (
              <Book book={book} key={book.isbn} />
            );
          })
        }
      </List>
    );
  }
}

Books.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Books));
