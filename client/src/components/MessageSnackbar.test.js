import React from 'react';
import { MessageSnackbar } from './MessageSnackbar';
import { mount } from 'enzyme';

const MSG = 'test message';
const KEY = 'testSnackbar';
let state, wrapper, onClose, clearSnackbar;

describe('when shown', () => {
  beforeEach(() => {
    state = { shown: { [KEY]: true } };
    onClose = jest.fn();
    clearSnackbar = jest.fn();
    wrapper = mount(
      <MessageSnackbar
        shown={state.shown}
        message={MSG}
        snackbarKey={KEY}
        onClose={onClose}
        clearSnackbar={clearSnackbar}/>);
  });

  it('shows the message', () =>
    expect(wrapper.text()).toEqual(MSG));

  describe('when its SnackBar#onClose() is called', () => {

    beforeEach(() =>
      wrapper.find('Snackbar').props().onClose());

    it('calls onClosed()', () =>
      expect(onClose).toHaveBeenCalled());

    it('calls clearSnackbar()', () =>
      expect(clearSnackbar).toHaveBeenCalledWith(KEY));
  });
});

describe('when not shown with a matching key', () => {
  beforeEach(() => {
    state.shown = { onlyOtherKey: true };
    wrapper = mount(
      <MessageSnackbar
        shown={state.shown}
        message={MSG}
        snackbarKey={KEY}/>);
  });

  it('does not show the message', () => {
    expect(wrapper.text()).toBeFalsy();
  });
});

