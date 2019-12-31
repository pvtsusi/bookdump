import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Button from '../Button';
import AdminLogin from './AdminLogin';

jest.mock('../../reducers/user', () => {
  return {
    __esModule: true,
    setError: (field, message) => ({ type: 'mockSetError', field, message }),
    login: (user, pass, history) => ({ type: 'mockLogin', user, pass, history }),
    CLEAR_LOGIN_ERROR: 'mockClearError'
  };
});

const mockStore = configureMockStore([thunk]);

let store, wrapper;
const nameSelector = 'ForwardRef(TextField)#admin-name-input';
const passSelector = 'ForwardRef(TextField)#admin-password-input[type="password"]';
const name = 'Username';
const pass = 'Password';
const nameError = 'Bad name?';
const passError = 'Invalid password!';
const history = 'mockHistory';

describe('with no errors', () => {
  beforeEach(() => {
    store = mockStore({
      progress: { loading: false },
      user: { errors: {} }
    });
    wrapper = mount(
      <Provider store={store}>
        <AdminLogin history={history}/>
      </Provider>
    );
  });

  it('renders the label text', () =>
    expect(wrapper.text()).toContain('Log in as admin'));

  it('renders the Log in button in enabled state', () => {
    expect(wrapper.find(Button).text()).toEqual('Log in');
    expect(wrapper.find(Button).prop('disabled')).toBeFalsy();
  });

  it('renders the Name input field in enabled state', () => {
    expect(wrapper.find(nameSelector).text()).toMatch('Name');
    expect(wrapper.find(nameSelector).prop('disabled')).toBeFalsy();
  });

  it('auto focuses on the Name input field', () =>
    expect(wrapper.find(nameSelector).prop('autoFocus')).toBeTruthy());

  it('renders the Password input field as password input type and in enabled state', () => {
    expect(wrapper.find(passSelector).text()).toMatch('Password');
    expect(wrapper.find(passSelector).prop('disabled')).toBeFalsy();
  });


  describe('when changing the Name field', () => {
    beforeEach(() =>
      wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } }));

    it('dispatches error clearing', () =>
      expect(store.getActions()).toEqual([{ type: 'mockClearError' }]));
  });

  describe('when changing the Password field', () => {
    beforeEach(() =>
      wrapper.find(passSelector).find('input').simulate('change', { target: { value: pass } }));

    it('dispatches error clearing', () =>
      expect(store.getActions()).toEqual([{ type: 'mockClearError' }]));
  });

  describe('when submitting empty form', () => {
    beforeEach(() =>
      wrapper.find('form').simulate('submit'));

    it('sets empty field error for both Name and Password fields', () => {
      expect(store.getActions()).toContainEqual({
        type: 'mockSetError',
        field: 'name',
        message: 'Name cannot be empty'
      });
      expect(store.getActions()).toContainEqual({
        type: 'mockSetError',
        field: 'pass',
        message: 'Password cannot be empty'
      });
    });

    it('dispatches login with empty name and empty password', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockLogin',
        user: '',
        pass: '',
        history: 'mockHistory'
      }));
  });

  describe('when submitting name but empty password', () => {
    beforeEach(() => {
      wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } });
      wrapper.find('form').simulate('submit');
    });

    it('sets empty field error for Password field', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockSetError',
        field: 'pass',
        message: 'Password cannot be empty'
      }));

    it('dispatches login with empty password', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockLogin',
        user: name,
        pass: '',
        history
      }));
  });

  describe('when submitting password but empty name', () => {
    beforeEach(() => {
      wrapper.find(passSelector).find('input').simulate('change', { target: { value: pass } });
      wrapper.find('form').simulate('submit');
    });

    it('sets empty field error for Name field', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockSetError',
        field: 'name',
        message: 'Name cannot be empty'
      }));

    it('dispatches login with empty name', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockLogin',
        user: '',
        pass: pass,
        history
      }));
  });

  describe('when submitting with both name and password', () => {
    beforeEach(() => {
      wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } });
      wrapper.find(passSelector).find('input').simulate('change', { target: { value: pass } });
      wrapper.find('form').simulate('submit');
    });

    it('does not set an error', () => {
      expect(store.getActions().find(action => action.type === 'mockSetError')).toBeFalsy();
    });

    it('dispatches login with the name end the password', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockLogin',
        user: name,
        pass,
        history
      }));
  });
});

describe('when loading is in progress', () => {
  beforeEach(() => {
    const store = mockStore({
      progress: { loading: true },
      user: { errors: {} }
    });
    wrapper = mount(
      <Provider store={store}>
        <AdminLogin history={history}/>
      </Provider>
    );
  });

  it('renders the Log in button in disabled state', () =>
    expect(wrapper.find(Button).prop('disabled')).toBeTruthy());

  it('renders the Name input field in disabled state', () =>
    expect(wrapper.find(nameSelector).prop('disabled')).toBeTruthy());

  it('renders the Password input field as password input type', () =>
    expect(wrapper.find(passSelector).prop('disabled')).toBeTruthy());
});

describe('with errors for password', () => {
  beforeEach(() => {
    const store = mockStore({
      progress: { loading: false },
      user: { errors: { pass: passError } }
    });
    wrapper = mount(
      <Provider store={store}>
        <AdminLogin history={history}/>
      </Provider>
    );
  });

  it('renders the error in the Password field helper text', () =>
    expect(wrapper.find('p#admin-password-input-helper-text').text()).toMatch(passError));

  it('renders the TextField in error state', () =>
    expect(wrapper.find(passSelector).prop('error')).toBeTruthy());
});

describe('with errors for name', () => {
  beforeEach(() => {
    const store = mockStore({
      progress: { loading: false },
      user: { errors: { name: nameError } }
    });
    wrapper = mount(
      <Provider store={store}>
        <AdminLogin history={history}/>
      </Provider>
    );
  });

  it('renders the error in the Name field helper text', () =>
    expect(wrapper.find('p#admin-name-input-helper-text').text()).toMatch(nameError));

  it('renders the TextField in error state', () =>
    expect(wrapper.find(nameSelector).prop('error')).toBeTruthy());
});