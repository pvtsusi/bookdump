import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SessionPopover from './SessionPopover';

jest.mock('..', () => {
  return {
    __esModule: true,
    startLoggingOut: () => ({ type: 'mockStartLoggingOut' })
  };
});

function MockLogoutDialog() {
  return (<div/>);
}
jest.mock('./LogoutDialog', () => {
  return {
    __esModule: true,
    default: () => {
      return (<MockLogoutDialog/>);
    }
  };
});


const mockStore = configureMockStore([thunk]);

let store, wrapper;
const userName = 'User Name';

describe('when a non-admin user is signed in', () => {
  beforeEach(() => {
    store = mockStore({
      session: { user: { name: userName } }
    });
    wrapper = mount(
      <Provider store={store}>
        <SessionPopover/>
      </Provider>
    );
  });

  it('renders the active-session icon button', () =>
    expect(wrapper.exists(IconButton)).toBeTruthy());

  it('contains the log-out dialog', () =>
    expect(wrapper.exists(MockLogoutDialog)).toBeTruthy());

  it('has the pop-over closed initially', () =>
    expect(wrapper.find(Popover).prop('open')).toBeFalsy());

  describe('when the icon button is clicked', () => {
    beforeEach(() =>
      wrapper.find(IconButton).simulate('click'));

    it('renders an explanation that the session is open', () =>
      expect(wrapper.text()).toContain(`You are signed in as ${userName}`));

    it('renders the logout button', () =>
      expect(wrapper.exists('Button#start-logging-out-button')).toBeTruthy());

    describe('and then when the logout button is clicked', () => {
      beforeEach(() =>
        wrapper.find('Button#start-logging-out-button').simulate('click'));

      it('dispatches the start-logging-out action', () =>
        expect(store.getActions()).toContainEqual({
          type: 'mockStartLoggingOut'
        }));
    });

    describe('and then when the popover is closed', () => {
      beforeEach(() =>
        wrapper.find(Popover).invoke('onClose')());

      it('has the pop-over closed initially', () =>
        expect(wrapper.find(Popover).prop('open')).toBeFalsy());
    });
  });
});

describe('when an admin sessions is signed in', () => {
  beforeEach(() => {
    store = mockStore({
      session: { user: { name: userName, admin: true } }
    });
    wrapper = mount(
      <Provider store={store}>
        <SessionPopover/>
      </Provider>
    );
  });

  describe('when the icon button is clicked', () => {
    beforeEach(() =>
      wrapper.find(IconButton).simulate('click'));

    it('renders a message indicating the user is an admin', () =>
      expect(wrapper.text()).toContain(`You are signed in as ${userName} (admin)`));
  });
});

describe('when no user is signed in', () => {
  beforeEach(() => {
    store = mockStore({
      session: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <SessionPopover/>
      </Provider>
    );
  });

  it('does not render anything', () =>
    expect(wrapper.isEmptyRender()).toBeTruthy());
});