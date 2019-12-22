import React from 'react';
import { AdminLogin } from './AdminLogin';
import Button from '../Button';
import { mount } from 'enzyme';

let state, wrapper, clearErrors, setError, login;
const nameSelector = 'TextField#admin-name-input';
const passSelector = 'TextField#admin-password-input[type="password"]';
const name = 'Username';
const pass = 'Password';
const nameError = 'Bad name?';
const passError = 'Invalid password!';
const history = 'mockHistory';

describe('with no errors', () => {
  beforeEach(() => {
    state = {};
    clearErrors = jest.fn();
    setError = jest.fn();
    login = jest.fn();
    wrapper = mount(<AdminLogin history={history} login={login} setError={setError} clearErrors={clearErrors}/>);
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

    it('calls clearErrors()', () =>
      expect(clearErrors).toHaveBeenCalled());

    it('sets state property name', () =>
      expect(wrapper.find('AdminLogin').state().name).toEqual(name));
  });

  describe('when changing the Password field', () => {
    beforeEach(() =>
      wrapper.find(passSelector).find('input').simulate('change', { target: { value: pass } }));

    it('calls clearErrors()', () =>
      expect(clearErrors).toHaveBeenCalled());

    it('sets state property pass', () =>
      expect(wrapper.find('AdminLogin').state().pass).toEqual(pass));
  });

  describe('when submitting empty form', () => {
    beforeEach(() =>
      wrapper.find('form').simulate('submit'));

    it('sets empty field error for both Name and Password fields', () => {
      expect(setError).toHaveBeenCalledTimes(2);
      expect(setError).toHaveBeenNthCalledWith(1, 'name', 'Name cannot be empty');
      expect(setError).toHaveBeenNthCalledWith(2, 'pass', 'Pass cannot be empty');
    });

    it('calls login() with empty name and empty password', () =>
      expect(login).toHaveBeenCalledWith('', '', history));
  });

  describe('when submitting name but empty password', () => {
    beforeEach(() => {
      wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } });
      wrapper.find('form').simulate('submit');
    });

    it('sets empty field error for Password field', () => {
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith('pass', 'Pass cannot be empty');
    });

    it('calls login() with empty password', () =>
      expect(login).toHaveBeenCalledWith(name, '', history));
  });

  describe('when submitting password but empty name', () => {
    beforeEach(() => {
      wrapper.find(passSelector).find('input').simulate('change', { target: { value: pass } });
      wrapper.find('form').simulate('submit');
    });

    it('sets empty field error for Name field', () => {
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith('name', 'Name cannot be empty');
    });

    it('calls login() with empty name', () =>
      expect(login).toHaveBeenCalledWith('', pass, history));
  });

  describe('when submitting with both name and password', () => {
    beforeEach(() => {
      wrapper.find(nameSelector).find('input').simulate('change', { target: { value: name } });
      wrapper.find(passSelector).find('input').simulate('change', { target: { value: pass } });
      wrapper.find('form').simulate('submit');
    });

    it('does not set an error', () => {
      expect(setError).not.toHaveBeenCalled();
    });

    it('calls login() with the name end the password', () =>
      expect(login).toHaveBeenCalledWith(name, pass, history));
  });
});

describe('when loading is in progress', () => {
  beforeEach(() => {
    state = { loading: true };
    wrapper = mount(<AdminLogin loading={state.loading}/>);
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
    state = { errors: { pass: passError } };
    wrapper = mount(<AdminLogin errors={state.errors}/>);
  });

  it('renders the error in the Password field helper text', () =>
    expect(wrapper.find('p#admin-password-input-helper-text').text()).toMatch(passError));

  it('renders the TextField in error state', () =>
    expect(wrapper.find(passSelector).prop('error')).toBeTruthy());
});

describe('with errors for name', () => {
  beforeEach(() => {
    state = { errors: { name: nameError } };
    wrapper = mount(<AdminLogin errors={state.errors}/>);
  });

  it('renders the error in the Name field helper text', () =>
    expect(wrapper.find('p#admin-name-input-helper-text').text()).toMatch(nameError));

  it('renders the TextField in error state', () =>
    expect(wrapper.find(nameSelector).prop('error')).toBeTruthy());
});