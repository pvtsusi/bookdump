import React from 'react';
import { ReserveButton } from './ReserveButton';
import Button from '../Button';
import { mount } from 'enzyme';

let state, wrapper, reserveBook, declineBook;
const book = { isbn: 'isbn' };
const reserverName = 'Reserver Name';
const reservedBook = { ...book, reserverName };
function MockLoginDialog() {
  return <div/>;
}

jest.mock('../sessions/LoginDialog', () => {
  return {
    __esModule: true,
    default: (props) => {
      return <MockLoginDialog onSuccess={props.onSuccess}/>;
    }
  };
});

describe('with no reservation', () => {
  beforeEach(() => {
    state = { book: book };
    reserveBook = jest.fn();
    wrapper = mount(<ReserveButton book={state.book} reserveBook={reserveBook}/>);
  });

  it('renders the reservation button', () =>
    expect(wrapper.find(Button).text()).toEqual('I want this'));

  describe('on button click', () => {
    beforeEach(() =>
      wrapper.find(Button).simulate('click'));

    it('tries to reserve the book', () =>
      expect(reserveBook).toBeCalledWith(book));
  });

  describe('when login succeeds', () => {
    beforeEach(() =>
      wrapper.find(MockLoginDialog).invoke('onSuccess')());

    it('tries to reserve the book', () =>
      expect(reserveBook).toBeCalledWith(book));
  });
});

describe('with reservation', () => {
  beforeEach(() => {
    state = { book: reservedBook };
    declineBook = jest.fn();
    wrapper = mount(<ReserveButton book={state.book} declineBook={declineBook}/>);
  });

  it('renders the decline reservation button', () =>
    expect(wrapper.find(Button).text()).toEqual('Never mind'));

  describe('on button click', () => {
    beforeEach(() =>
      wrapper.find(Button).simulate('click'));

    it('declines the reservation', () =>
      expect(declineBook).toBeCalledWith(reservedBook));
  });
});

describe('with no book selected', () => {
  beforeEach(() => {
    state = {};
    wrapper = mount(<ReserveButton book={state.book}/>);
  });

  it('will not render anything', () =>
    expect(wrapper.isEmptyRender()).toBeTruthy());
});


