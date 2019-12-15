import React from 'react';
import { TooSlowSnackbar } from './TooSlowSnackbar';
import { mount } from 'enzyme';

let state, wrapper, confirmTooSlow;

jest.mock('../MessageSnackbar', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <div onClose={props.onClose}>{props.open ? props.message : ''}</div>;
    }
  };
});

describe('when shown', () => {
  beforeEach(() => {
    state = { tooSlow: true };
    confirmTooSlow = jest.fn();
    wrapper = mount(
      <TooSlowSnackbar confirmTooSlow={confirmTooSlow} tooSlow={state.tooSlow}/>);
  });

  it('shows the message', () =>
    expect(wrapper.text()).toEqual('Sorry, someone was quicker than you.'));

  describe('when its onClose() is called', () => {

    beforeEach(() =>
      wrapper.find(TooSlowSnackbar).simulate('close'));

    it('calls confirmTooSlow()', () =>
      expect(confirmTooSlow).toHaveBeenCalled());
  });
});

describe('when not shown', () => {
  beforeEach(() => {
    state = {};
    wrapper = mount(
      <TooSlowSnackbar tooSlow={state.tooSlow}/>);
  });

  it('does not show the message', () => {
    expect(wrapper.text()).toBeFalsy();
  });
});

