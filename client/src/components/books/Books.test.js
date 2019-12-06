import React from 'react';
import { Books } from './Books';
import Progress from '../Progress';
import { mount } from 'enzyme';

jest.mock('./Book', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div data-key={props.book.isbn} onSelect={props.onSelect}/>;
    }
  };
});

jest.mock('./BookDialog', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div id="mockBookDialog" data-book={props.book}/>;
    }
  };
});

let state, wrapper, getBooks, selectBook;
const book1 = { isbn: 'isbn1' };
const book2 = { isbn: 'isbn2' };
const books = [ book1, book2 ];
const error = 'This is an error.';

describe('with books', () => {
  beforeEach(() => {
    state = { books: books };
    getBooks = jest.fn();
    selectBook = jest.fn();
    wrapper = mount(<Books books={state.books} getBooks={getBooks} selectBook={selectBook}/>);
  });

  it('calls getBooks() on mount', () => {
    expect(getBooks).toBeCalled();
  });

  it('renders a list of the books', () => {
    expect(wrapper.exists(`ul [data-key="${book1.isbn}"]`)).toBeTruthy();
    expect(wrapper.exists(`ul [data-key="${book2.isbn}"]`)).toBeTruthy();
  });

  it('renders BookDialog', () =>
    expect(wrapper.exists('#mockBookDialog')).toBeTruthy());

  describe('when a book has been selected', () => {
    beforeEach(() => {
      state = { books: books, selected: book2.isbn };
      getBooks = jest.fn();
      selectBook = jest.fn();
      wrapper = mount(<Books books={state.books}
                             selected={state.selected}
                             getBooks={getBooks}
                             selectBook={selectBook}/>);
    });

    it('the selected book is passed to the dialog', () => {
      expect(wrapper.exists({ id: 'mockBookDialog', 'data-book': book2 })).toBeTruthy()
    });
  });

  describe('when selecting a book from the list', () => {
    beforeEach(() =>
      wrapper.find(`div[data-key="${book2.isbn}"]`).invoke('onSelect')());

    it('calls selectBook() with the selected book object', () =>
      expect(selectBook).toHaveBeenCalledWith(book2));
  });
});

describe('with empty books list', () => {
  beforeEach(() => {
    state = { books: [] };
    getBooks = jest.fn();
    wrapper = mount(<Books books={state.books} getBooks={getBooks}/>);
  });

  it('renders a "No books" message', () =>
    expect(wrapper.text()).toEqual('No books'));
});

describe('with an error', () => {
  beforeEach(() => {
    state = { books: [], error: error };
    getBooks = jest.fn();
    wrapper = mount(<Books books={state.books} error={state.error} getBooks={getBooks}/>);
  });

  it('renders the error message', () =>
    expect(wrapper.text()).toEqual(`Error: ${error}`));

  it('renders no books', () => {
    expect(wrapper.exists(`ul [data-key="${book1.isbn}"]`)).toBeFalsy();
    expect(wrapper.exists(`ul [data-key="${book2.isbn}"]`)).toBeFalsy();
  });
});

describe('with books list being still null', () => {
  beforeEach(() => {
    state = { books: null };
    getBooks = jest.fn();
    wrapper = mount(<Books books={state.books} getBooks={getBooks}/>);
  });

  it('renders a progress spinner', () =>
    expect(wrapper.exists(Progress)).toBeTruthy());
});