import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { startLoading, endLoading } from './progressActions';
import { LOADING, LOADED } from './progressConstants';

const mockStore = configureMockStore([thunk]);

let store;

describe('progress actions', () => {
  beforeEach(() => {
    store = mockStore();
  });

  it('startLoading() dispatches LOADING', () => {
    store.dispatch(startLoading());
    expect(store.getActions()).toEqual([{
      type: LOADING
    }]);
  });

  it('endLoading() dispatches LOADED', () => {
    store.dispatch(endLoading());
    expect(store.getActions()).toEqual([{
      type: LOADED
    }]);
  });
});
