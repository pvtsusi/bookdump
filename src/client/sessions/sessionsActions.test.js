import {
  startLoggingIn,
  login,
  cancelLogin,
  startLoggingOut,
  logout,
  cancelLogout,
  loggedOut,
  setError,
  clearErrors
} from './sessionsActions';
import {
  CANCEL_LOGIN,
  CANCEL_LOGOUT,
  CLEAR_LOGIN_ERROR,
  LOG_IN,
  LOG_OUT,
  LOGGED_IN,
  LOGGED_OUT,
  LOGIN_ERROR
} from './sessionsConstants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('redux-react-session', () => {
  return {
    __esModule: true,
    sessionService: {
      saveSession: jest.fn(),
      deleteSession: jest.fn(),
      saveUser: jest.fn(),
      deleteUser: jest.fn()
    }
  };
});

import { sessionService as mockSessionService } from 'redux-react-session';

let mockError = null;
let mockLoginFn = jest.fn();
let mockForgetFn = jest.fn();

jest.mock('../agent', () => {
  return {
    __esModule: true,
    default: {
      Session: {
        login: async (loginName, loginPass) => {
          const response = mockLoginFn(loginName, loginPass);
          if (mockError) {
            throw mockError;
          } else {
            return response;
          }
        },
        forget: async () => {
          mockForgetFn();
          if (mockError) {
            throw mockError;
          }
        }
      }
    }
  };
});

jest.mock('../progress', () => {
  return {
    __esModule: true,
    startLoading: () => ({ type: 'mockStartLoading' }),
    endLoading: () => ({ type: 'mockEndLoading' })
  };
});

jest.mock('../books', () => {
  return {
    __esModule: true,
    getBooks: () => ({ type: 'mockGetBooks' }),
    declineBook: (book) => ({ type: 'mockDeclineBook', book }),
    reserveBook: (book) => ({ type: 'mockReserveBook', book })
  };
});

jest.mock('../snackbar', () => {
  return {
    __esModule: true,
    showSnackbar: (key, message) => ({ type: 'mockShowSnackbar', key, message }),
    SNACKBAR_LOGGED_OUT: 'mockLoggedOut',
    SNACKBAR_ERROR: 'mockError'
  };
});

const mockStore = configureMockStore([thunk]);

let store;

describe('sessions actions', () => {
  const isbn = 'isbn1';
  const loginName = 'Login Name';
  const loginPass = 'password';

  beforeEach(() => {
    mockError = null;
    mockLoginFn = jest.fn();
    mockForgetFn = jest.fn();
    jest.clearAllMocks();
    store = mockStore({
      errors: {}
    });
  });

  it('startLoggingIn() dispatches LOG_IN with given onSuccess action name and isbn for the action', () => {
    store.dispatch(startLoggingIn('reserve', isbn));
    expect(store.getActions()).toEqual([{
      type: LOG_IN,
      onSuccess: 'reserve',
      isbn
    }]);
  });

  describe('when there are no login errors', () => {
    const token = 'token value';
    const name = 'User Name';
    const sha = 'user sha';
    const admin = false;
    const loginResponse = { token, name, sha, admin };

    const expectRemoteLoginAndSession = () => {
      expect(mockLoginFn).toHaveBeenCalledWith(loginName, loginPass);
      expect(mockLoginFn).toHaveBeenCalledTimes(1);
      expect(mockSessionService.saveSession).toHaveBeenCalledWith({ token });
      expect(mockSessionService.saveSession).toHaveBeenCalledTimes(1);
      expect(mockSessionService.saveUser).toHaveBeenCalledWith({ name, admin, sha });
      expect(mockSessionService.saveUser).toHaveBeenCalledTimes(1);
    };

    describe('with no onSuccess action', () => {
      beforeEach(async () => {
        mockLoginFn = jest.fn(() => loginResponse);
        await store.dispatch(login(loginName, loginPass));
      });

      it('dispatches loading start, LOGGED_IN, and loading end', () =>
        expect(store.getActions()).toEqual([
          {
            type: 'mockStartLoading'
          }, {
            type: LOGGED_IN
          }, {
            type: 'mockEndLoading'
          }
        ]));

      it('calls remote login and then creates local session', expectRemoteLoginAndSession);
    });

    describe('with reserve onSuccess action', () => {
      const onSuccess = 'reserve';

      beforeEach(async () => {
        mockLoginFn = jest.fn(() => loginResponse);
        await store.dispatch(login(loginName, loginPass, onSuccess, isbn));
      });

      it('dispatches loading start, LOGGED_IN, reserve book and loading end', () =>
        expect(store.getActions()).toEqual([
          {
            type: 'mockStartLoading'
          }, {
            type: LOGGED_IN
          }, {
            type: 'mockReserveBook',
            book: { isbn }
          }, {
            type: 'mockEndLoading'
          }
        ]));

      it('calls remote login and then creates local session', expectRemoteLoginAndSession);
    });

    describe('with decline onSuccess action', () => {
      const onSuccess = 'decline';

      beforeEach(async () => {
        mockLoginFn = jest.fn(() => loginResponse);
        await store.dispatch(login(loginName, loginPass, onSuccess, isbn));
      });

      it('dispatches loading start, LOGGED_IN, decline book and loading end', () =>
        expect(store.getActions()).toEqual([
          {
            type: 'mockStartLoading'
          }, {
            type: LOGGED_IN
          }, {
            type: 'mockDeclineBook',
            book: { isbn }
          }, {
            type: 'mockEndLoading'
          }
        ]));

      it('calls remote login and then creates local session', expectRemoteLoginAndSession);
    });
  });

  const expectRemoteLoginButNoSession = () => {
    expect(mockLoginFn).toHaveBeenCalledWith(loginName, loginPass);
    expect(mockLoginFn).toHaveBeenCalledTimes(1);
    expect(mockSessionService.saveSession).not.toHaveBeenCalled();
    expect(mockSessionService.saveUser).not.toHaveBeenCalled();
  };

  describe('when there is a 401 Unauthorized error', () => {
    beforeEach(async () => {
      mockError = { status: 401, statusText: 'Unauthorized' };
      mockLoginFn = jest.fn();
      mockForgetFn = jest.fn();
      jest.clearAllMocks();
      store = mockStore({
        errors: {}
      });
      await store.dispatch(login(loginName, loginPass));
    });

    it('dispatches loading start, LOGIN_ERROR with authentication error and loading end', () =>
      expect(store.getActions()).toEqual([
        {
          type: 'mockStartLoading'
        }, {
          type: LOGIN_ERROR,
          field: 'pass',
          message: 'Invalid password'
        }, {
          type: 'mockEndLoading'
        }
      ]));

    it('calls remote login but does not create a session', expectRemoteLoginButNoSession);
  });

  describe('when there is an unexpected error', () => {
    beforeEach(async () => {
      mockError = { status: 500, statusText: 'Internal Server Error' };
      mockLoginFn = jest.fn();
      mockForgetFn = jest.fn();
      jest.clearAllMocks();
      store = mockStore({
        errors: {}
      });
      await store.dispatch(login(loginName, loginPass));
    });

    it('dispatches loading start, LOGIN_ERROR and loading end', () =>
      expect(store.getActions()).toEqual([
        {
          type: 'mockStartLoading'
        }, {
          type: LOGIN_ERROR,
          field: 'pass',
          message: 'Failed to log in'
        }, {
          type: 'mockEndLoading'
        }
      ]));

    it('calls remote login but does not create a session', expectRemoteLoginButNoSession);
  });

  it('cancelLogin() dispatches CANCEL_LOGIN', () => {
    store.dispatch(cancelLogin());
    expect(store.getActions()).toEqual([{
      type: CANCEL_LOGIN
    }]);
  });

  it('startLoggingOut() dispatches LOG_OUT', () => {
    store.dispatch(startLoggingOut());
    expect(store.getActions()).toEqual([{
      type: LOG_OUT
    }]);
  });

  describe('when there are no logout errors', () => {

    const expectLogoutDispatches = () =>
      expect(store.getActions()).toEqual([
        {
          type: 'mockStartLoading'
        }, {
          type: 'mockGetBooks'
        }, {
          type: 'mockShowSnackbar',
          key: 'mockLoggedOut',
          message: 'You have been logged out.'
        }, {
          type: 'LOGGED_OUT'
        }, {
          type: 'mockEndLoading'
        }
      ]);

    beforeEach(() => {
      mockError = null;
      mockLoginFn = jest.fn();
      mockForgetFn = jest.fn();
      jest.clearAllMocks();
      store = mockStore({
        errors: {}
      });
    });

    describe('as a non-admin user', () => {
      const admin = false;
      beforeEach(async () => {
        await store.dispatch(logout(admin));
      });

      it('dispatches loading start, get books, snackbar, logged-out and loading end', expectLogoutDispatches);

      it('calls remote to forget the user', () =>
        expect(mockForgetFn).toHaveBeenCalledTimes(1));

      it('deletes local user session', () => {
        expect(mockSessionService.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockSessionService.deleteSession).toHaveBeenCalledTimes(1);
      });
    });

    describe('as an admin user', () => {
      const admin = true;
      beforeEach(async () => {
        await store.dispatch(logout(admin));
      });

      it('dispatches loading start, get books, snackbar, logged-out and loading end', expectLogoutDispatches);

      it('does not call remote to forget the user', () =>
        expect(mockForgetFn).not.toHaveBeenCalled());

      it('deletes local user session', () => {
        expect(mockSessionService.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockSessionService.deleteSession).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when there is a logout error', () => {
    beforeEach(async () => {
      mockError = { status: 500, statusText: 'error message' };
      mockLoginFn = jest.fn();
      mockForgetFn = jest.fn();
      jest.clearAllMocks();
      store = mockStore({
        errors: {}
      });
      await store.dispatch(logout(false));
    });

    it('dispatches loading start, logout error snackbar and loading end', () =>
      expect(store.getActions()).toEqual([
        {
          type: 'mockStartLoading'
        }, {
          type: 'mockShowSnackbar',
          key: 'mockError',
          message: 'Error: error message'
        }, {
          type: 'mockEndLoading'
        }
      ]));

    it('calls remote to forget the user', () =>
      expect(mockForgetFn).toHaveBeenCalledTimes(1));

    it('does not delete the local user session', () => {
      expect(mockSessionService.deleteUser).not.toHaveBeenCalled();
      expect(mockSessionService.deleteSession).not.toHaveBeenCalled();
    });
  });

  it('cancelLogout() dispatches CANCEL_LOG_OUT', () => {
    store.dispatch(cancelLogout());
    expect(store.getActions()).toEqual([{
      type: CANCEL_LOGOUT
    }]);
  });

  it('loggedOut() dispatches LOGGED_OUT', () => {
    store.dispatch(loggedOut());
    expect(store.getActions()).toEqual([{
      type: LOGGED_OUT
    }]);
  });

  it('setError() dispatches LOGIN_ERROR with the given field and message', () => {
    const field = 'field name';
    const message = 'error message';
    store.dispatch(setError(field, message));
    expect(store.getActions()).toEqual([{
      type: LOGIN_ERROR,
      field,
      message
    }]);
  });

  it('clearErrors() dispatches CLEAR_ERRORS', () => {
    store.dispatch(clearErrors());
    expect(store.getActions()).toEqual([{
      type: CLEAR_LOGIN_ERROR
    }]);
  });
});