import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginDialog from './LoginDialog';

jest.mock('..', () => {
  return {
    __esModule: true,
    cancelLogin: () => ({ type: 'mockCancelLogin' }),
    clearErrors: () => ({ type: 'mockClearErrors' }),
    login: (user, pass, onSuccess) => ({ type: 'mockLogin', user, pass, onSuccess }),
    setError: (field, message) => ({ type: 'mockSetError', field, message })
  };
});

const mockStore = configureMockStore([thunk]);

let store, wrapper, onSuccess;
const nameSelector = 'ForwardRef(TextField)#name-input';
const name = 'Username';
const nameError = 'Bad name!';

describe('when logging in', () => {
  const loggingIn = true;
  describe('with no errors', () => {
    beforeEach(() => {
      onSuccess = jest.fn();
      store = mockStore({
        progress: { loading: false },
        user: { loggingIn, errors: {} }
      });
      wrapper = mount(
        <Provider store={store}>
          <LoginDialog onSuccess={onSuccess}/>
        </Provider>
      );
    });

    it('renders the dialog title', () =>
      expect(wrapper.text()).toContain('Who are you?'));

    it('renders the dialog content', () =>
      expect(wrapper.text()).toContain('Give me your name so that I know whom to give this to.'));

    it('renders the Submit button in enabled state', () => {
      expect(wrapper.find('Button[type="submit"]').text()).toEqual('Submit');
      expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBeFalsy();
    });

    it('renders the Your name input field in enabled state', () => {
      expect(wrapper.find(nameSelector).text()).toMatch('Your name');
      expect(wrapper.find(nameSelector).prop('disabled')).toBeFalsy();
    });

    it('auto focuses on the Your name input field', () =>
      expect(wrapper.find(nameSelector).prop('autoFocus')).toBeTruthy());

    describe('when changing the Your name field', () => {
      beforeEach(() =>
        wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } }));

      it('dispatches error clearing', () =>
        expect(store.getActions()).toEqual([{ type: 'mockClearErrors' }]));
    });

    describe('when submitting empty name', () => {
      beforeEach(() =>
        wrapper.find('form').simulate('submit'));

      it('sets empty field error to the Your name field', () =>
        expect(store.getActions()).toContainEqual({
          type: 'mockSetError',
          field: 'name',
          message: 'Don\'t leave this empty'
        }));

      it('dispatches login with empty name', () =>
        expect(store.getActions()).toContainEqual({
          type: 'mockLogin',
          user: '',
          pass: null,
          onSuccess
        }));
    });

    describe('when submitting the name', () => {
      beforeEach(() => {
        wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } });
        wrapper.find('form').simulate('submit');
      });

      it('does not set an error', () =>
        expect(store.getActions().find(action => action.type === 'mockSetError')).toBeFalsy());

      it('dispatches login with the name', () => {
        expect(store.getActions()).toContainEqual({
          type: 'mockLogin',
          user: name,
          pass: null,
          onSuccess
        });
      });
    });

    describe('when canceling', () => {
      beforeEach(() =>
        wrapper.find('Button#cancel-login').simulate('click'));

      it('dispatches login cancellation', () =>
        expect(store.getActions()).toContainEqual({ type: 'mockCancelLogin' }));
    });

    describe('when the dialog is closed', () => {
      beforeEach(() =>
        wrapper.find('ForwardRef(Dialog)').invoke('onClose')());

      it('dispatches login cancellation', () =>
        expect(store.getActions()).toContainEqual({ type: 'mockCancelLogin' }));
    });
  });

  describe('when loading is in progress', () => {
    beforeEach(() => {
      onSuccess = jest.fn();
      store = mockStore({
        progress: { loading: true },
        user: { loggingIn, errors: {} }
      });
      wrapper = mount(
        <Provider store={store}>
          <LoginDialog onSuccess={onSuccess}/>
        </Provider>
      );
    });

    it('renders the Submit button in disabled state', () =>
      expect(wrapper.find('Button[type="submit"]').prop('disabled')).toBeTruthy());

    it('renders the Your name input field in disabled state', () =>
      expect(wrapper.find(nameSelector).prop('disabled')).toBeTruthy());
  });

  describe('with errors for the Your name field', () => {
    beforeEach(() => {
      onSuccess = jest.fn();
      store = mockStore({
        progress: { loading: false },
        user: { loggingIn, errors: { name: nameError } }
      });
      wrapper = mount(
        <Provider store={store}>
          <LoginDialog onSuccess={onSuccess}/>
        </Provider>
      );
    });

    it('renders the error in the Your name field helper text', () =>
      expect(wrapper.find('p#name-input-helper-text').text()).toMatch(nameError));

    it('renders the TextField in error state', () =>
      expect(wrapper.find(nameSelector).prop('error')).toBeTruthy());
  });
});

describe('when not logging in', () => {
  beforeEach(() => {
    onSuccess = jest.fn();
    store = mockStore({
      progress: { loading: false },
      user: { loggingIn: false, errors: {} }
    });
    wrapper = mount(
      <Provider store={store}>
        <LoginDialog onSuccess={onSuccess}/>
      </Provider>
    );
  });

  it('renders does not render the dialog', () =>
    expect(wrapper.isEmptyRender()).toBeTruthy());
});

