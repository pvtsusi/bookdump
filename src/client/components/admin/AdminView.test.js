import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AdminView from './AdminView';

const mockStore = configureMockStore([thunk]);

jest.mock('../../reducers/books', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    getBooks: () => ({ type: 'mockGetBooks' }),
    declineBook: (book) => ({ type: 'mockDeclineBook', book }),
    CONFIRM_MARK_DELIVERED: 'mockConfirmDelivered'
  };
});

jest.mock('./AdminLogin', () => {
  return {
    __esModule: true,
    default: () => {
      return <div id="mockAdminLogin"/>;
    }
  };
});


let store, wrapper;
const reserverA = 'a';
const reserverAName = 'Reserver A';
const reserverB = 'b';
const reserverBName = 'Reserver B';
const book1 = { isbn: 'isbn1', title: 'Book 1', reserver: reserverA, reserverName: reserverAName };
const book2 = { isbn: 'isbn2', title: 'Book 2', reserver: reserverA, reserverName: reserverAName };
const book3 = { isbn: 'isbn3', title: 'Book 3', reserver: reserverB, reserverName: reserverBName };
const booksByReserver = {
  [reserverA]: [book1, book2],
  [reserverB]: [book3]
};
const error = 'This is an error.';

describe('as admin', () => {
  const session = { authenticated: true, user: { admin: true } };

  describe('with books', () => {
    let reserversList, listA, listB, listABook1, listABook2, listBBook3;
    beforeEach(() => {
      store = mockStore({
        session,
        books: { booksByReserver }
      });
      wrapper = mount(
        <Provider store={store}>
          <AdminView/>
        </Provider>
      );
      reserversList = wrapper.find('[data-testid="reserversList"]');
      listA = reserversList.find(`li[data-key="${reserverA}"]`);
      listABook1 = listA.find(`ul ForwardRef(ListItem)[data-key="${book1.isbn}"]`);
      listABook2 = listA.find(`ul ForwardRef(ListItem)[data-key="${book2.isbn}"]`);
      listB = reserversList.find(`li[data-key="${reserverB}"]`);
      listBBook3 = listB.find(`ul ForwardRef(ListItem)[data-key="${book3.isbn}"]`);
    });

    it('dispatches getBooks on mount', () =>
      expect(store.getActions()).toEqual([{ type: 'mockGetBooks' }]));

    it('renders a list of reservers', () => {
      expect(reserversList.exists()).toBeTruthy();
      expect(listA.find('ForwardRef(ListSubheader)').text()).toMatch(reserverAName);
      expect(listB.find('ForwardRef(ListSubheader)').text()).toMatch(reserverBName);
    });

    it('renders lists of books per reserver', () => {
      expect(listABook1.text()).toMatch(book1.title);
      expect(listABook2.text()).toMatch(book2.title);
      expect(listBBook3.text()).toMatch(book3.title);
    });

    describe('when canceling a reservation', () => {
      beforeEach(() =>
        listABook1.find('ForwardRef(Tooltip)[title="Cancel reservation"] button').simulate('click'));

      it('dispatches a declination', () =>
        expect(store.getActions()).toContainEqual({ type: 'mockDeclineBook', book: book1 }));
    });

    describe('when marking delivered', () => {
      beforeEach(() =>
        listA.find('ForwardRef(Tooltip)[title="Mark all delivered"] button').simulate('click'));

      it('dispatches a confirmation for the delivery', () =>
        expect(store.getActions()).toContainEqual({ type: 'mockConfirmDelivered', reserver: reserverA }));
    });
  });

  describe('with empty books list', () => {
    beforeEach(() => {
      store = mockStore({
        session,
        books: { booksByReserver: {} }
      });
      wrapper = mount(
        <Provider store={store}>
          <AdminView/>
        </Provider>
      );
    });

    it('renders a "No reserved books" message', () =>
      expect(wrapper.text()).toEqual('No reserved books'));
  });

  describe('with an error', () => {
    beforeEach(() => {
      store = mockStore({
        session,
        books: { booksByReserver, error }
      });
      wrapper = mount(
        <Provider store={store}>
          <AdminView/>
        </Provider>
      );
    });

    it('renders the error message', () =>
      expect(wrapper.text()).toEqual(`Error: ${error}`));

    it('renders no lists of books', () =>
      expect(wrapper.exists('ul')).toBeFalsy());
  });
});

describe('as a non-admin', () => {
  beforeEach(() => {
    store = mockStore({
      session: {},
      books: { booksByReserver }
    });
    wrapper = mount(
      <Provider store={store}>
        <AdminView/>
      </Provider>
    );
  });

  it('renders the admin login', () =>
    expect(wrapper.exists('#mockAdminLogin')).toBeTruthy());

  it('renders no lists of books', () =>
    expect(wrapper.exists('ul')).toBeFalsy());
});

