import React from 'react';
import { BookField } from './BookField';
import { mount } from 'enzyme';

let state, wrapper, editBook, updateBook;
const KEY = 'mockField';
const CONTENT = 'mockContent';
const book = {
  [KEY]: 'mockField'
};

describe('when the user is not an admin', () => {
  beforeEach(() => {
    state = { admin: false };
    editBook = jest.fn();
    wrapper = mount(
      <BookField field={KEY} book={book} editing={null} admin={state.admin} editBook={editBook}>
        {CONTENT}
      </BookField>);
  });

  it('renders the content', () =>
    expect(wrapper.text()).toEqual(CONTENT));

  describe('clicking the field', () => {
    beforeEach(() =>
      wrapper.find(BookField).simulate('click'));

    it('does not call editBook()', () =>
      expect(editBook).not.toBeCalled());
  });

});

describe('when the user is an admin', () => {
  beforeEach(() => {
    state = { admin: true };
    editBook = jest.fn();
    wrapper = mount(
      <BookField field={KEY} book={book} editing={null} admin={state.admin} editBook={editBook}>
        {CONTENT}
      </BookField>);
  });

  it('renders the content', () =>
    expect(wrapper.text()).toEqual(CONTENT));

  describe('clicking the field', () => {
    beforeEach(() =>
      wrapper.find(BookField).simulate('click'));

    it('calls editBook() with the field key', () =>
      expect(editBook).toHaveBeenCalledWith(KEY));
  });
});

describe('when editing the field', () => {
  beforeEach(() => {
    state = { admin: true };
    updateBook = jest.fn();
    wrapper = mount(
      <BookField field={KEY} book={book} editing={true} admin={state.admin} updateBook={updateBook}>
        {CONTENT}
      </BookField>);
  });

  it('renders the book field value as input helper', () =>
    expect(wrapper.find('p#title-input-helper-text').text()).toEqual(book[KEY]));

  describe('changing and submitting the value', () => {
    beforeEach(() => {
      wrapper.find('input#title-input').simulate('change', { target: { value: 'new value'} });
      wrapper.find('form').simulate('submit');
    });

    it('calls updateBook() with updated value and reference to the book and field', () => {
      expect(updateBook).toBeCalledWith(book, KEY, 'new value')
    });
  });
});
