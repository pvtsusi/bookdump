import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent'
import Book from './Book';

const mapStateToProps = state => ({
  books: state.books.books
});

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: 'BOOKS_VIEW_LOADED', payload })
});

class Books extends React.Component {
  componentWillMount () {
    this.props.onLoad(agent.Books.all());
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
