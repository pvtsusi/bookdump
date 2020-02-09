import Zoom from '@material-ui/core/Zoom';
import React from 'react';
import { FINISH_RESERVATION } from '../booksConstants';
import ReservedBanner from './ReservedBanner';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

let store, wrapper, currentUser;
const book = { isbn: 'isbn' };
const userName = 'Reserver Name';

describe('when reserved for current user', () => {
  beforeEach(() => {
    currentUser = userName;
  });

  describe('when the reservation exists', () => {
    beforeEach(() => {
      store = mockStore({
        session: { user: { name: currentUser } },
        books: { reservations: { [book.isbn]: 'exists' } }
      });
      wrapper = mount(
        <Provider store={store}>
          <ReservedBanner isbn={book.isbn} reserver={userName}/>
        </Provider>
      );
    });

    it('renders a message that the reservation is for the current user', () =>
      expect(wrapper.text()).toEqual('Reserved for you'));

    it('does not animate the banner', () =>
      expect(wrapper.find(Zoom).exists({ timeout: 0 })).toBeTruthy());
  });

  describe('when the reservation is being set up', () => {
    beforeEach(() => {
      store = mockStore({
        session: { user: { name: currentUser } },
        books: { reservations: { [book.isbn]: 'coming' } }
      });
      wrapper = mount(
        <Provider store={store}>
          <ReservedBanner isbn={book.isbn} reserver={userName}/>
        </Provider>
      );
    });

    it('animates the banner in', () =>
      expect(wrapper.find(Zoom).exists({ timeout: 500 })).toBeTruthy());

    describe('when the enter transition is complete', () => {
      beforeEach(() =>
        wrapper.find(Zoom).invoke('onEntered')());

      it('calls transitioned() with the book isbn', () =>
        expect(store.getActions()).toEqual([{ type: FINISH_RESERVATION, isbn: book.isbn }]));
    });
  });

  describe('when the reservation is being declined', () => {
    beforeEach(() => {
      store = mockStore({
        session: { user: { name: currentUser } },
        books: { reservations: { [book.isbn]: 'going' } }
      });
      wrapper = mount(
        <Provider store={store}>
          <ReservedBanner isbn={book.isbn} reserver={userName}/>
        </Provider>
      );
    });

    it('animates the banner out', () =>
      expect(wrapper.find(Zoom).exists({ timeout: 500 })).toBeTruthy());

    describe('when the exit transition is complete', () => {
      beforeEach(() =>
        wrapper.find(Zoom).invoke('onExited')());

      it('calls transitioned() with the book isbn', () =>
        expect(store.getActions()).toEqual([{ type: FINISH_RESERVATION, isbn: book.isbn }]));
    });
  });

  describe('when reserved for someone else', () => {
    const otherReserver = 'Someone Else';
    beforeEach(() => {
      store = mockStore({
        session: { user: { name: currentUser } },
        books: { reservations: { [book.isbn]: 'exists' } }
      });
      wrapper = mount(
        <Provider store={store}>
          <ReservedBanner isbn={book.isbn} reserver={otherReserver}/>
        </Provider>
      );
    });

    it('renders a message that the reservation is for the reserver', () =>
      expect(wrapper.text()).toEqual(`Reserved for ${otherReserver}`));
  });
});