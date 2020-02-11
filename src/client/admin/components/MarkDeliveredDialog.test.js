import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MarkDeliveredDialog from './MarkDeliveredDialog';

const mockStore = configureMockStore([thunk]);

jest.mock('../../books', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    cancelMarkDelivered: () => ({ type: 'mockCancelMarkDelivered' }),
    markDelivered: (reserver) => ({ type: 'mockMarkDelivered', reserver })
  };
});

let store, wrapper;
const reserver = 'a';

describe('when not confirming deliveries', () => {
  beforeEach(() => {
    store = mockStore({ books: {}});
    wrapper = mount(
      <Provider store={store}>
        <MarkDeliveredDialog/>
      </Provider>
    );
  });

  it('does not open the dialog', () =>
    expect(wrapper.find('ForwardRef(Dialog)').prop('open')).toBeFalsy());
});

describe('when when confirming deliveries', () => {
  beforeEach(() => {
    store = mockStore({ books: { markDelivered: reserver }});
    wrapper = mount(
      <Provider store={store}>
        <MarkDeliveredDialog/>
      </Provider>
    );
  });

  it('renders the dialog', () =>
    expect(wrapper.find('ForwardRef(Dialog)').prop('open')).toBeTruthy());

  describe('canceling the delivery', () => {
    beforeEach(() =>
      wrapper.find('Button[data-testid="cancel-delivery-button"]').simulate('click'));

    it('dispatches delivery cancellation', () =>
      expect(store.getActions()).toEqual([{ type: 'mockCancelMarkDelivered'}]));
  });

  describe('confirming the delivery', () => {
    beforeEach(() =>
      wrapper.find('Button[data-testid="confirm-delivery-button"]').simulate('click'));

    it('dispatches delivery confirmation', () =>
      expect(store.getActions()).toEqual([{ type: 'mockMarkDelivered', reserver }]));
  });
});
