import { LOADING, LOADED } from './progressConstants';
import reducer from './progressReducer';

describe('progressReducer', () => {
  it('returns the initial state', () =>
    expect(reducer(undefined, {})).toEqual({
      loading: false
    }));

  it('LOADING sets loading true', () =>
    expect(reducer({}, { type: LOADING })).toEqual({ loading: true }));

  it('LOADED sets loading false', () =>
    expect(reducer({}, { type: LOADED })).toEqual({ loading: false }));
});