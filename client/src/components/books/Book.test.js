import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HowToVote from '@material-ui/icons/HowToVote';
import Star from '@material-ui/icons/Star';
import React from 'react';
import Book from './Book';
import { mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

jest.mock('../../cover.mjs', () => {
  return {
    __esModule: true,
    default: (url, sizeSuffix) => `mock_cover_${sizeSuffix}.png`
  };
});

let wrapper, onSelect;
const book = {
  cover: 'https://example.org/cover.png',
  title: 'Das Fenster',
  author: 'Pauliina Susi',
  isbn: '9783423261449',
  recommended: false
};

describe('not recommended book that is not reserved', () => {
  beforeEach(() => {
    onSelect = jest.fn();
    const store = mockStore({
      session: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <Book book={book} key={book.isbn} onSelect={onSelect}/>
      </Provider>
    );
  });

  it('renders the book title', () =>
    expect(wrapper.text()).toContain(book.title));

  it('renders the book author', () =>
    expect(wrapper.text()).toContain(book.title));

  it('renders the cover thumbnail', () =>
    expect(wrapper.exists('img[src="mock_cover_120.png"]')).toBeTruthy());

  it('renders no icon', () =>
    expect(wrapper.exists(ListItemIcon)).toBeFalsy());

  describe('when clicked', () => {
    beforeEach(() =>
      wrapper.find(ListItem).simulate('click'));

    it('selects the book', () =>
      expect(onSelect).toHaveBeenCalled());
  });
});

describe('a book without cover', () => {
  beforeEach(() => {
    const store = mockStore({
      session: {}
    });
    const { cover, ...bookWithoutCover } = book;
    wrapper = mount(
      <Provider store={store}>
        <Book book={bookWithoutCover} key={bookWithoutCover.isbn}/>
      </Provider>
    );
  });

  it('renders without the cover thumbnail', () =>
    expect(wrapper.exists('img')).toBeFalsy());
});

describe('a recommended book', () => {

  const recommendedBook = { ...book, recommended: true };

  describe('that is not reserved', () => {
    beforeEach(() => {
      const store = mockStore({
        session: {}
      });
      wrapper = mount(
        <Provider store={store}>
          <Book book={recommendedBook} key={recommendedBook.isbn}/>
        </Provider>
      );
    });

    it('renders the recommended icon', () =>
      expect(wrapper.exists(Star)).toBeTruthy());

    it('renders the recommended tooltip', () =>
      expect(wrapper.exists('ForwardRef(Tooltip)[title="Recommended"]')).toBeTruthy());

    it('does not render the reserved icon', () =>
      expect(wrapper.exists(HowToVote)).toBeFalsy());
  });

  describe('that is reserved', () => {
    beforeEach(() => {
      const recommendedAndReservedBook = { ...recommendedBook, reserverName: 'A Reserver' };
      const store = mockStore({
        session: {}
      });
      wrapper = mount(
        <Provider store={store}>
          <Book book={recommendedAndReservedBook} key={recommendedAndReservedBook.isbn}/>
        </Provider>
      );
    });

    it('does not render the recommended icon', () =>
      expect(wrapper.exists(Star)).toBeFalsy());

    it('renders the reserved icon', () =>
      expect(wrapper.exists(HowToVote)).toBeTruthy());
  });
});

describe('a reserved book', () => {
  const reserverName = 'A Reserver';
  const reservedBook = { ...book, reserverName: reserverName };

  beforeEach(() => {
    const store = mockStore({
      session: { user: { name: 'Someone Else' }}
    });
    wrapper = mount(
      <Provider store={store}>
        <Book book={reservedBook} key={reservedBook.isbn}/>
      </Provider>
    );
  });

  it('renders the reserved icon', () =>
    expect(wrapper.exists(HowToVote)).toBeTruthy());

  it('renders a tooltip showing the reserver name', () =>
    expect(wrapper.exists(`ForwardRef(Tooltip)[title="Reserved for ${reserverName}"]`)).toBeTruthy());

  describe('reserved to the current user', () => {
    beforeEach(() => {
      const store = mockStore({
        session: { user: { name: reserverName }}
      });
      wrapper = mount(
        <Provider store={store}>
          <Book book={reservedBook} key={reservedBook.isbn}/>
        </Provider>
      );
    });

    it('renders a tooltip showing the reserver to be the current user', () =>
      expect(wrapper.exists('ForwardRef(Tooltip)[title="Reserved for you"]')).toBeTruthy());
  });
});

