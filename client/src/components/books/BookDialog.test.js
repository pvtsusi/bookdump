import React from 'react';
import { BookDialog } from './BookDialog';
import { mount } from 'enzyme';

jest.mock('./BookField', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div>{props.children}</div>;
    }
  };
});

jest.mock('./ReserveButton', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    }
  };
});

jest.mock('./ReservedBanner', () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    }
  };
});

jest.mock('../../cover.mjs', () => {
  return {
    __esModule: true,
    default: (url, sizeSuffix) => `${sizeSuffix}.png`
  };
});

let state, wrapper, deselectBook;
const book = {
  cover: 'https://example.org/cover.png',
  title: 'Das Fenster',
  author: 'Pauliina Susi',
  language: 'deu',
  isbn: '9783423261449',
  recommended: true,
  height: 540,
  width: 405
};

describe('when a book is selected', () => {
  beforeEach(() => {
    state = {};
    deselectBook = jest.fn();
    wrapper = mount(<BookDialog
      editing={state.editing}
      book={book}
      deselectBook={deselectBook}/>);
  });

  it('renders the book title', () =>
    expect(wrapper.text()).toContain(book.title));

  it('renders the book author', () =>
    expect(wrapper.text()).toContain(book.author));

  describe('when the dialog is closed', () => {
    beforeEach(() => {
      wrapper.find('[data-testid="bookDialogCloseButton"]').simulate('click');
    });

    it('deselects the book', () => {
      expect(deselectBook).toHaveBeenCalled();
    });
  });
});
