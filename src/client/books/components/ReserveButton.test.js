import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Button } from '../../app';
import ReserveButton from './ReserveButton';

const mockStore = configureMockStore([thunk]);

let store, wrapper;
const book = { isbn: 'isbn' };
const reserverName = 'Reserver Name';
const reservedBook = { ...book, reserverName };

jest.mock('../booksActions', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    reserveBook: (book) => ({ type: 'mockReserveBook', book }),
    declineBook: (book) => ({ type: 'mockDeclineBook', book })
  };
});

function MockLoginDialog() {
  return <div/>;
}

jest.mock('../../sessions', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    LoginDialog: () => {
      return <MockLoginDialog/>;
    }
  };
});

describe('with no reservation', () => {
  beforeEach(() => {
    store = mockStore();
    wrapper = mount(
      <Provider store={store}>
        <ReserveButton book={book}/>
      </Provider>
    );
  });

  it('renders the reservation button', () =>
    expect(wrapper.find(Button).text()).toEqual('I want this'));

  describe('on button click', () => {
    beforeEach(() =>
      wrapper.find(Button).simulate('click'));

    it('tries to reserve the book', () =>
      expect(store.getActions()).toEqual([{ type: 'mockReserveBook', book }]));
  });
});

describe('with reservation', () => {
  beforeEach(() => {
    store = mockStore();
    wrapper = mount(
      <Provider store={store}>
        <ReserveButton book={reservedBook}/>
      </Provider>
    );
  });

  it('renders the decline reservation button', () =>
    expect(wrapper.find(Button).text()).toEqual('Never mind'));

  describe('on button click', () => {
    beforeEach(() =>
      wrapper.find(Button).simulate('click'));

    it('declines the reservation', () => {
      const expectedBook = { ...book, reserverName };
      expect(store.getActions()).toEqual([{ type: 'mockDeclineBook', book: expectedBook }]);
    });
  });
});

describe('with no book selected', () => {
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <ReserveButton book={null}/>
      </Provider>
    );
  });

  it('will not render anything', () =>
    expect(wrapper.isEmptyRender()).toBeTruthy());
});


