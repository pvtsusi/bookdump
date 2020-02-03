import Snackbar from '@material-ui/core/Snackbar';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MessageSnackbar from './MessageSnackbar';

jest.mock('../reducers/snackbar', () => {
  return {
    __esModule: true,
    clearSnackbar: (key) => ({ type: 'mockClearSnackbar', key })
  };
});

const mockStore = configureMockStore([thunk]);

const MSG = 'test message';
const KEY = 'testSnackbar';

let wrapper, store, onClose;

describe('when shown', () => {
  beforeEach(() => {
    onClose = jest.fn();
    store = mockStore({
      snackbar: { shown: { [KEY]: true } }
    });
    wrapper = mount(
      <Provider store={store}>
        <MessageSnackbar message={MSG} snackbarKey={KEY} onClose={onClose}/>
      </Provider>
    );
  });

  it('shows the message', () =>
    expect(wrapper.text()).toEqual(MSG));

  describe('when its SnackBar#onClose() is called', () => {

    beforeEach(() =>
      wrapper.find(Snackbar).invoke('onClose')());

    it('calls onClosed()', () =>
      expect(onClose).toHaveBeenCalled());

    it('dispatches snackbar clearing', () =>
      expect(store.getActions()).toContainEqual({
        type: 'mockClearSnackbar',
        key: KEY
      }));
  });
});

describe('when not shown with a matching key', () => {
  beforeEach(() => {
    store = mockStore({
      snackbar: { shown: { someOtherKeyOnly: true } }
    });
    wrapper = mount(
      <Provider store={store}>
        <MessageSnackbar message={MSG} snackbarKey={KEY}/>
      </Provider>
    );
  });

  it('does not show the message', () => {
    expect(wrapper.text()).toBeFalsy();
  });
});

