import React from 'react';
import { connect } from 'react-redux';
import Book from './Book';
import { getBooks } from '../reducers/books';
import { bindActionCreators } from "redux";

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
  componentWillMount () {
    this.props.getBooks();
  }

  render () {
    if (!this.props.books) {
      return (
        <div>Loading...</div>
      );
    }

    if (this.props.books.length === 0) {
      return (
        <div>No books</div>
      );
    }

    return (
      <div>
        {
          this.props.books.map(book => {
            return (
              <Book book={book} key={book.isbn} />
            );
          })
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Books);
