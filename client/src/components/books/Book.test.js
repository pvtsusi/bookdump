import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HowToVote from '@material-ui/icons/HowToVote';
import Star from '@material-ui/icons/Star';
import React from 'react';
import { Book } from './Book';
import { mount } from 'enzyme';

jest.mock('../../cover.mjs', () => {
  return {
    __esModule: true,
    default: (url, sizeSuffix) => `mock_cover_${sizeSuffix}.png`
  };
});

let state, wrapper, onSelect;
const book = {
  cover: 'https://example.org/cover.png',
  title: 'Das Fenster',
  author: 'Pauliina Susi',
  isbn: '9783423261449',
  recommended: false
};

describe('not recommended book that is not reserved', () => {
  beforeEach(() => {
    state = {};
    onSelect = jest.fn();
    wrapper = mount(<Book book={book} key={book.isbn} userName={state.userName} onSelect={onSelect}/>);
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
    state = {};
    const { cover, ...bookWithoutCover } = book;
    wrapper = mount(<Book book={bookWithoutCover} key={book.isbn} userName={state.userName}/>);
  });

  it('renders without the cover thumbnail', () =>
    expect(wrapper.exists('img')).toBeFalsy());
});

describe('a recommended book', () => {

  const recommendedBook = { ...book, recommended: true };

  describe('that is not reserved', () => {
    beforeEach(() => {
      state = {};
      wrapper = mount(<Book book={recommendedBook} key={book.isbn} userName={state.userName}/>);
    });

    it('renders the recommended icon', () =>
      expect(wrapper.exists(Star)).toBeTruthy());

    it('renders the recommended tooltip', () =>
      expect(wrapper.exists('Tooltip[title="Recommended"]')).toBeTruthy());

    it('does not render the reserved icon', () =>
      expect(wrapper.exists(HowToVote)).toBeFalsy());
  });

  describe('that is reserved', () => {
    beforeEach(() => {
      state = {};
      const recommendedAndReservedBook = { ...recommendedBook, reserverName: 'A Reserver' };
      wrapper = mount(<Book book={recommendedAndReservedBook} key={book.isbn} userName={state.userName}/>);
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
    state = { userName: 'Someone Else' };
    wrapper = mount(<Book book={reservedBook} key={book.isbn}/>);
  });

  it('renders the reserved icon', () =>
    expect(wrapper.exists(HowToVote)).toBeTruthy());

  it('renders a tooltip showing the reserver name', () =>
    expect(wrapper.exists(`Tooltip[title="Reserved for ${reserverName}"]`)).toBeTruthy());

  describe('reserved to the current user', () => {
    beforeEach(() => {
      state = { userName: reserverName };
      wrapper = mount(<Book book={reservedBook} key={book.isbn} userName={state.userName}/>);
    });

    it('renders a tooltip showing the reserver to be the current user', () =>
      expect(wrapper.exists('Tooltip[title="Reserved for you"]')).toBeTruthy());
  });
});
