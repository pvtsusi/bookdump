import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LogoutDialog from './LogoutDialog';

jest.mock('../../reducers/user', () => {
  return {
    __esModule: true,
    cancelLogout: () => ({ type: 'mockCancelLogout' }),
    logout: (admin) => ({ type: 'mockLogout', admin })
  };
});

const mockStore = configureMockStore([thunk]);

let store, wrapper;

describe('when logging out', () => {
  const loggingOut = true;

  describe('as non-admin user', () => {
    beforeEach(() => {
      store = mockStore({
        user: { loggingOut },
        session: { user: {} }
      });
      wrapper = mount(
        <Provider store={store}>
          <LogoutDialog/>
        </Provider>
      );
    });

    it('should render the confirmation dialog title', () =>
      expect(wrapper.text()).toContain('Are you sure you want to sign out?'));

    it('should warn about the permanent deletion of the session', () =>
      expect(wrapper.text()).toContain('I will forget you and all about you.'));

    it('should render the logout button', () =>
      expect(wrapper.exists('Button#logout-button')).toBeTruthy());

    describe('when clicking logout', () => {
      beforeEach(() =>
        wrapper.find('Button#logout-button').simulate('click'));

      it('dispatches logout as non-admin', () =>
        expect(store.getActions()).toContainEqual({
          type: 'mockLogout'
        }));

      describe('when clicking cancel', () => {
        beforeEach(() =>
          wrapper.find('Button#cancel-logout-button').simulate('click'));

        it('dispatches logout cancellation', () =>
          expect(store.getActions()).toContainEqual({
            type: 'mockCancelLogout'
          }));
      });
    });
  });

  describe('as an admin user', () => {
    beforeEach(() => {
      store = mockStore({
        user: { loggingOut },
        session: { authenticated: true, user: { admin: true } }
      });
      wrapper = mount(
        <Provider store={store}>
          <LogoutDialog/>
        </Provider>
      );
    });

    it('should render the confirmation dialog title', () =>
      expect(wrapper.text()).toContain('Are you sure you want to sign out?'));

    it('should warn not warn about the permanent deletion of the session', () =>
      expect(wrapper.text()).not.toContain('I will forget you and all about you.'));

    describe('when clicking logout', () => {
      beforeEach(() =>
        wrapper.find('Button#logout-button').simulate('click'));

      it('dispatches logout as admin', () =>
        expect(store.getActions()).toContainEqual({
          type: 'mockLogout',
          admin: true
        }));

      describe('when clicking cancel', () => {
        beforeEach(() =>
          wrapper.find('Button#cancel-logout-button').simulate('click'));

        it('dispatches logout cancellation', () =>
          expect(store.getActions()).toContainEqual({
            type: 'mockCancelLogout'
          }));
      });
    });
  });
});

describe('when not logging out', () => {
  beforeEach(() => {
    store = mockStore({
      user: { loggingOut: false },
      session: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <LogoutDialog/>
      </Provider>
    );
  });

  it('should not render anything', () =>
    expect(wrapper.isEmptyRender()).toBeTruthy());
});
