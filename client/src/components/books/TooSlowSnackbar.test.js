import React from 'react';
import { CONFIRM_TOO_SLOW } from '../../reducers/books';
import TooSlowSnackbar from './TooSlowSnackbar';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

let store, wrapper;

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
    store = mockStore({
      books: { tooSlow: true }
    });
    wrapper = mount(
      <Provider store={store}>
        <TooSlowSnackbar/>
      </Provider>
    );
  });

  it('shows the message', () =>
    expect(wrapper.text()).toEqual('Sorry, someone was quicker than you.'));

  describe('when its onClose() is called', () => {

    beforeEach(() =>
      wrapper.find(TooSlowSnackbar).simulate('close'));

    it('dispatches confirmation for the too-slow snackbar', () =>
      expect(store.getActions()).toEqual([{ type: CONFIRM_TOO_SLOW }]));
  });
});

describe('when not shown', () => {
  beforeEach(() => {
    store = mockStore({
      books: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <TooSlowSnackbar/>
      </Provider>
    );
  });

  it('does not show the message', () => {
    expect(wrapper.text()).toBeFalsy();
  });
});

