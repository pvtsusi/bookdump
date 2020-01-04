import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import BookField from './BookField';

const mockStore = configureMockStore([thunk]);

jest.mock('../../reducers/books', () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    __esModule: true,
    editBook: (field) => ({ type: 'mockEditBook', field }),
    updateBook: (book, field, value) => ({ type: 'mockUpdateBook', book, field, value }),
  };
});

let store, wrapper;
const KEY = 'mockField';
const CONTENT = 'mockContent';
const book = {
  [KEY]: 'mockField'
};

describe('when the user is not an admin', () => {
  beforeEach(() => {
    store = mockStore({
      session: {}
    });
    wrapper = mount(
      <Provider store={store}>
        <BookField field={KEY} book={book} editing={null}>
          {CONTENT}
        </BookField>
      </Provider>
    );
  });

  it('renders the content', () =>
    expect(wrapper.text()).toEqual(CONTENT));
});

describe('when the user is an admin', () => {
  beforeEach(() => {
    store = mockStore({
      session: { authenticated: true, user: { admin: true }}
    });
    wrapper = mount(
      <Provider store={store}>
        <BookField field={KEY} book={book} editing={null}>
          {CONTENT}
        </BookField>
      </Provider>
    );
  });

  it('renders the content', () =>
    expect(wrapper.text()).toEqual(CONTENT));

  describe('clicking the field', () => {
    beforeEach(() =>
      wrapper.find(BookField).simulate('click'));

    it('calls editBook() with the field key', () =>
      expect(store.getActions()).toEqual([{
        type: 'mockEditBook',
        field: KEY
      }]));
  });
});

describe('when editing the field', () => {
  beforeEach(() => {
    store = mockStore({
      session: { authenticated: true, user: { admin: true }}
    });
    wrapper = mount(
      <Provider store={store}>
        <BookField field={KEY} book={book} editing={true}>
          {CONTENT}
        </BookField>
      </Provider>
    );
  });

  it('renders the book field value as input helper', () =>
    expect(wrapper.find('p#title-input-helper-text').text()).toEqual(book[KEY]));

  describe('changing and submitting the value', () => {
    beforeEach(() => {
      wrapper.find('input#title-input').simulate('change', { target: { value: 'new value'} });
      wrapper.find('form').simulate('submit');
    });

    it('calls updateBook() with updated value and reference to the book and field', () =>
      expect(store.getActions()).toEqual([{
        type: 'mockUpdateBook',
        book,
        field: KEY,
        value: 'new value'
      }]));
  });
});
