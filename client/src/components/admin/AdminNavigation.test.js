import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Link, MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AdminNavigation from './AdminNavigation';

const mockStore = configureMockStore([thunk]);

let store, wrapper;

describe('as admin', () => {
  const session = { authenticated: true, user: { admin: true } };

  describe('on admin view', () => {
    beforeEach(() => {
      store = mockStore({ session });
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[ '/admin' ]}>
            <AdminNavigation/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('links to home view', () =>
      expect(wrapper.find(Link).prop('to')).toEqual('/'));
  });

  describe('on home view', () => {
    beforeEach(() => {
      store = mockStore({ session });
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[ '/' ]}>
            <AdminNavigation/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('links to the admin view', () =>
      expect(wrapper.find(Link).prop('to')).toEqual('/admin'));
  });
});

describe('as a non-admin', () => {
  const session = {};

  describe('on admin view', () => {
    beforeEach(() => {
      store = mockStore({ session });
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[ '/admin' ]}>
            <AdminNavigation/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('does not render a link', () =>
      expect(wrapper.exists(Link)).toBeFalsy());
  });

  describe('on home view', () => {
    beforeEach(() => {
      store = mockStore({ session });
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[ '/' ]}>
            <AdminNavigation/>
          </MemoryRouter>
        </Provider>
      );
    });

    it('does not render a link', () =>
      expect(wrapper.exists(Link)).toBeFalsy());
  });
});

