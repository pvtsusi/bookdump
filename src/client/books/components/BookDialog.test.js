import DialogContent from '@material-ui/core/DialogContent';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DESELECT_BOOK } from '../booksConstants';
import BookDialog from './BookDialog';

const mockStore = configureMockStore([thunk]);

jest.mock('./BookField', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div data-field={props.field} data-editing={props.editing}>{props.children}</div>;
    }
  };
});

jest.mock('./ReserveButton', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div id="mockReserveButton" data-book={props.book}>mockReserveButton</div>;
    }
  };
});

jest.mock('./ReservedBanner', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div
        id="mockReservedBanner"
        data-isbn={props.isbn}
        data-reserver={props.reserver}>
        mockReservedBanner
      </div>;
    }
  };
});

jest.mock('../../cover', () => {
  return {
    __esModule: true,
    default: (url, sizeSuffix) => `mock_cover_${sizeSuffix}.png`
  };
});

let wrapper, store;

const book = {
  cover: 'https://example.org/cover.png',
  title: 'Das Fenster',
  author: 'Pauliina Susi',
  language: 'deu',
  isbn: '9783423261449',
  recommended: true,
  height: 100,
  width: 100,
  reserver: 'deadbeef',
  reserverName: 'Reserver'
};

describe('when a book is selected', () => {
  beforeEach(() => {
    store = mockStore({
      books: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <BookDialog book={book}/>
      </Provider>
    );
  });

  it('renders the DialogContent', () =>
    expect(wrapper.exists(DialogContent)).toBeTruthy());

  it('renders the book title', () =>
    expect(wrapper.text()).toContain(book.title));

  it('renders the book author', () =>
    expect(wrapper.text()).toContain(book.author));

  it('passes the selected book to the reserve button', () =>
    expect(wrapper.exists({ id: 'mockReserveButton', 'data-book': book })).toBeTruthy());

  it('passes the book ISBN to the reserved banner', () =>
    expect(wrapper.exists({ id: 'mockReservedBanner', 'data-isbn': book.isbn })).toBeTruthy());

  it('passes the book reserver name to the reserved banner', () =>
    expect(wrapper.exists({ id: 'mockReservedBanner', 'data-reserver': book.reserverName })).toBeTruthy());

  it('renders the cover image', () =>
    expect(wrapper.exists('img[src="mock_cover_810.png"]')).toBeTruthy());

  describe('when the dialog is closed', () => {
    beforeEach(() =>
      wrapper.find({ 'data-testid': 'bookDialogCloseButton' }).simulate('click'));

    it('deselects the book', () =>
      expect(store.getActions()).toEqual([{type: DESELECT_BOOK}]));
  });

  describe('when title field is edited', () => {
    beforeEach(() => {
      store = mockStore({
        books: { editing: 'title' }
      });
      wrapper = mount(
        <Provider store={store}>
          <BookDialog book={book}/>
        </Provider>
      );
    });

    it('renders the title field with true editing prop', () =>
      expect(wrapper.exists({ 'data-field': 'title', 'data-editing': true })).toBeTruthy());

    it('renders the author field with false editing prop', () =>
      expect(wrapper.exists({ 'data-field': 'author', 'data-editing': false })).toBeTruthy());
  });

  describe('when author field is edited', () => {
    beforeEach(() => {
      store = mockStore({
        books: { editing: 'author' }
      });
      wrapper = mount(
        <Provider store={store}>
          <BookDialog book={book}/>
        </Provider>
      );
    });

    it('renders the title field with false editing prop', () =>
      expect(wrapper.exists({ 'data-field': 'title', 'data-editing': false })).toBeTruthy());

    it('renders the author field with true editing prop', () =>
      expect(wrapper.exists({ 'data-field': 'author', 'data-editing': true })).toBeTruthy());
  });

  describe('when there is no cover image', () => {
    beforeEach(() => {
      const { cover, ...bookWithoutCover } = book;
      store = mockStore({
        books: {}
      });
      wrapper = mount(
        <Provider store={store}>
          <BookDialog book={bookWithoutCover}/>
        </Provider>
      );
    });

    it('does not render a cover image', () =>
      expect(wrapper.exists('img')).toBeFalsy());
  });

  describe('when the cover image is tall', () => {
    beforeEach(() => {
      const tallBook = { ...book, height: 200 };
      store = mockStore({
        books: {}
      });
      wrapper = mount(
        <Provider store={store}>
          <BookDialog book={tallBook}/>
        </Provider>
      );
    });

    it('adjusts the left margin', () => {
      const offset = -68; // Half of (max edge length 270 / height 200 * width 100)
      expect(wrapper.exists({ src: 'mock_cover_810.png', style: { marginLeft: offset } })).toBeTruthy();
    });
  });

  describe('when the cover image is wide', () => {
    beforeEach(() => {
      const wideBook = { ...book, width: 200 };
      store = mockStore({
        books: {}
      });
      wrapper = mount(
        <Provider store={store}>
          <BookDialog book={wideBook}/>
        </Provider>
      );
    });

    it('adjusts the top margin', () => {
      const offset = -68; // Half of (max edge length 270 / width 200 * height 100)
      expect(wrapper.exists({ src: 'mock_cover_810.png', style: { marginTop: offset } })).toBeTruthy();
    });
  });
});

describe('when no book is selected', () => {
  beforeEach(() => {
    store = mockStore({
      books: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <BookDialog book={null}/>
      </Provider>
    );
  });

  it('DialogContent is not rendered', () =>
    expect(wrapper.exists(DialogContent)).toBeFalsy());
});


