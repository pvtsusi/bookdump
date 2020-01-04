import React from 'react';
import Books from './Books';
import Progress from '../Progress';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

jest.mock('../../reducers/books', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    getBooks: () => ({ type: 'mockGetBooks' }),
    selectBook: (book) => ({ type: 'mockSelectBook', book })
  };
});

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

let store, wrapper;
const book1 = { isbn: 'isbn1' };
const book2 = { isbn: 'isbn2' };
const books = [book1, book2];
const error = 'This is an error.';

describe('with books', () => {
  beforeEach(() => {
    store = mockStore({
      books: { books }
    });
    wrapper = mount(
      <Provider store={store}>
        <Books/>
      </Provider>
    );
  });

  it('dispatches getBooks on mount', () =>
    expect(store.getActions()).toEqual([{ type: 'mockGetBooks' }]));

  it('renders a list of the books', () => {
    expect(wrapper.exists(`ul [data-key="${book1.isbn}"]`)).toBeTruthy();
    expect(wrapper.exists(`ul [data-key="${book2.isbn}"]`)).toBeTruthy();
  });

  it('renders BookDialog', () =>
    expect(wrapper.exists('#mockBookDialog')).toBeTruthy());

  describe('when a book has been selected', () => {
    beforeEach(() => {
      store = mockStore({
        books: { books, selected: book2.isbn }
      });
      wrapper = mount(
        <Provider store={store}>
          <Books/>
        </Provider>
      );
    });

    it('the selected book is passed to the dialog', () => {
      expect(wrapper.exists({ id: 'mockBookDialog', 'data-book': book2 })).toBeTruthy();
    });
  });

  describe('when selecting a book from the list', () => {
    beforeEach(() =>
      wrapper.find(`div[data-key="${book2.isbn}"]`).invoke('onSelect')());

    it('dispatches selectBook with the selected book object', () =>
      expect(store.getActions()).toContainEqual({ type: 'mockSelectBook', book: book2 }));
  });
});

describe('with empty books list', () => {
  beforeEach(() => {
    store = mockStore({
      books: { books: [] }
    });
    wrapper = mount(
      <Provider store={store}>
        <Books/>
      </Provider>
    );
  });

  it('renders a "No books" message', () =>
    expect(wrapper.text()).toEqual('No books'));
});

describe('with an error', () => {
  beforeEach(() => {
    store = mockStore({
      books: { books, error }
    });
    wrapper = mount(
      <Provider store={store}>
        <Books/>
      </Provider>
    );
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
    store = mockStore({
      books: { books: null }
    });
    wrapper = mount(
      <Provider store={store}>
        <Books/>
      </Provider>
    );
  });

  it('renders a progress spinner', () =>
    expect(wrapper.exists(Progress)).toBeTruthy());
});