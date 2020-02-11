import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import openSocket from 'socket.io-client';
import WebSocketManager from './WebSocketManager';

let mockSocket;

jest.mock('socket.io-client', () => {
  return {
    __esModule: true,
    default: jest.fn(() => mockSocket)
  };
});

jest.mock('../reducers/socket', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    isValidSession: (socket) => ({ type: 'mockIsValidSession', socket }),
    sessionValidated: () => ({ type: 'mockSessionValidated' })
  };
});

jest.mock('../sessions', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    logout: (admin) => ({ type: 'mockLogout', admin })
  };
});


const mockStore = configureMockStore([thunk]);

let wrapper, store;
const userSha = 'user sha';
const otherUserSha = 'other user sha';

class MockSocket {
  constructor() {
    this.callbacks = {};
    this.on = jest.fn(this.on);
    this.off = jest.fn(this.off);
    this.close = jest.fn();
  }

  on(message, cb) {
    this.callbacks[message] = cb;
  }

  off(message) {
    delete this.callbacks[message];
  }

  receive(message, data) {
    if (this.callbacks[message]) {
      this.callbacks[message](data);
    }
  }
}

beforeEach(() => {
  jest.useFakeTimers();
  mockSocket = new MockSocket();
});

describe('with no session', () => {
  beforeEach(() => {
    store = mockStore({
      session: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <WebSocketManager/>
      </Provider>
    );
  });

  it('opens socket client connection on render', () =>
    expect(openSocket).toHaveBeenCalledWith('/'));

  it('subscribes to only session_validated and dispatch web socket messages', () => {
    expect(mockSocket.off).toHaveBeenCalledTimes(0);
    expect(mockSocket.on).toHaveBeenCalledTimes(2);
    expect(mockSocket.on).toHaveBeenCalledWith('session_validated', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('dispatch', expect.any(Function));
  });

  it('starts dispatching checks for session validity to the socket with 5 second intervals', () => {
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
    jest.runOnlyPendingTimers();
    expect(store.getActions()).toEqual([{
      type: 'mockIsValidSession',
      socket: { socket: mockSocket }
    }]);
  });

  describe('when the manager unmounts', () => {
    beforeEach(() =>
      wrapper.unmount());

    it('closes the socket', () =>
      expect(mockSocket.close).toHaveBeenCalledTimes(1));

    it('clears the session validity polling interval', () =>
      expect(clearInterval).toHaveBeenCalledTimes(1));
  });

  describe('when the socket receives session_validated successfully message', () => {
    beforeEach(() =>
      mockSocket.receive('session_validated', { valid: true }));

    it('dispatches the session validated action', () =>
      expect(store.getActions()).toEqual([{
        type: 'mockSessionValidated'
      }]));
  });

  describe('when the socket receives session_validated with failure message', () => {
    beforeEach(() =>
      mockSocket.receive('session_validated', { valid: false }));

    it('dispatches the logout action', () => {
      expect(store.getActions()).toContainEqual({
        type: 'mockLogout',
        admin: undefined
      });
    });

    it('dispatches the session validated action', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockSessionValidated'
      }));
  });

  describe('when the socket receives dispatch message with any originating user', () => {
    beforeEach(() =>
      mockSocket.receive('dispatch', {
        type: 'mockRemoteAction',
        origin: otherUserSha
      }));

    it('dispatches the remote action', () =>
      expect(store.getActions()).toEqual([{
        type: 'mockRemoteAction',
        origin: otherUserSha
      }]));
  });

  describe('as an admin user', () => {
    beforeEach(() => {
      store = mockStore({
        session: {
          authenticated: true,
          user: { admin: true }
        }
      });
      wrapper = mount(
        <Provider store={store}>
          <WebSocketManager/>
        </Provider>
      );
    });

    describe('when the socket receives session_validated with failure message', () => {
      beforeEach(() =>
        mockSocket.receive('session_validated', { valid: false }));

      it('dispatches the logout message with admin flag up', () =>
        expect(store.getActions()).toContainEqual({
          type: 'mockLogout',
          admin: true
        }));
    });
  });

  describe('as a signed-in user', () => {
    beforeEach(() => {
      store = mockStore({
        session: {
          authenticated: true,
          user: { sha: userSha }
        }
      });
      wrapper = mount(
        <Provider store={store}>
          <WebSocketManager/>
        </Provider>
      );
    });

    describe('when the socket receives dispatch message from the same originating user', () => {
      beforeEach(() =>
        mockSocket.receive('dispatch', {
          type: 'mockRemoteAction',
          origin: userSha
        }));

      it('does not dispatch the remote action', () =>
        expect(store.getActions().length).toEqual(0));
    });

    describe('when the socket receives dispatch message with another originating user', () => {
      beforeEach(() =>
        mockSocket.receive('dispatch', {
          type: 'mockRemoteAction',
          origin: otherUserSha
        }));

      it('dispatches the remote action', () =>
        expect(store.getActions()).toEqual([{
          type: 'mockRemoteAction',
          origin: otherUserSha
        }]));
    });

    describe('when the socket receives dispatch message with no originating user', () => {
      beforeEach(() =>
        mockSocket.receive('dispatch', {
          type: 'mockRemoteAction'
        }));

      it('dispatches the remote action', () =>
        expect(store.getActions()).toEqual([{
          type: 'mockRemoteAction'
        }]));
    });
  });

  describe('when the signed in user changes', () => {
    let state = {
      session: {
        authenticated: true,
        user: { sha: userSha }
      }
    };

    beforeEach(() => {
      store = mockStore(() => state);
      wrapper = mount(
        <Provider store={store}>
          <WebSocketManager/>
        </Provider>
      );
      state = {
        session: {
          authenticated: true,
          user: { sha: otherUserSha }
        }
      };
      store.dispatch({type: 'stateUpdated'});
      wrapper.setProps({});
    });

    it ('de-registers the dispatch message handler and re-registers it', () => {
      expect(mockSocket.off).toHaveBeenCalledTimes(1);
      expect(mockSocket.on).toHaveBeenCalledTimes(5);
      expect(mockSocket.on).toHaveBeenCalledWith('session_validated', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith ('dispatch', expect.any(Function));
      expect(mockSocket.on).toHaveBeenNthCalledWith(5, 'dispatch', expect.any(Function));
    });
  });

  describe('when the user type changes to admin', () => {
    let state = {
      session: {
        authenticated: true,
        user: { admin: false }
      }
    };

    beforeEach(() => {
      store = mockStore(() => state);
      wrapper = mount(
        <Provider store={store}>
          <WebSocketManager/>
        </Provider>
      );
      state = {
        session: {
          authenticated: true,
          user: { admin: true }
        }
      };
      store.dispatch({type: 'stateUpdated'});
      wrapper.setProps({});
    });

    it ('de-registers the session_validated message handler and re-registers it', () => {
      expect(mockSocket.off).toHaveBeenCalledTimes(1);
      expect(mockSocket.on).toHaveBeenCalledTimes(5);
      expect(mockSocket.on).toHaveBeenCalledWith('session_validated', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith ('dispatch', expect.any(Function));
      expect(mockSocket.on).toHaveBeenNthCalledWith(5, 'session_validated', expect.any(Function));
    });
  });
});