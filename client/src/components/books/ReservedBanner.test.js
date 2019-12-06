import Zoom from '@material-ui/core/Zoom/Zoom';
import React from 'react';
import { ReservedBanner } from './ReservedBanner';
import { mount } from 'enzyme';

let state, wrapper, transitioned;
const book = { isbn: 'isbn' };
const userName = 'Reserver Name';

describe('when reserved for current user', () => {
  beforeEach(() =>
    state = { userName: userName });

  describe('when the reservation exists', () => {
    beforeEach(() => {
      state.reservations = { [book.isbn]: 'exists' };
      transitioned = jest.fn();
      wrapper = mount(<ReservedBanner
        reservations={state.reservations}
        userName={state.userName}
        isbn={book.isbn}
        reserver={userName}
        transitioned={transitioned}/>);
    });

    it('renders a message that the reservation is for the current user', () =>
      expect(wrapper.text()).toEqual('Reserved for you'));

    it('does not animate the banner', () =>
      expect(wrapper.find(Zoom).exists({ timeout: 0 })).toBeTruthy());
  });

  describe('when the reservation is being set up', () => {
    beforeEach(() => {
      state.reservations = { [book.isbn]: 'coming' };
      transitioned = jest.fn();
      wrapper = mount(<ReservedBanner
        reservations={state.reservations}
        userName={state.userName}
        isbn={book.isbn}
        reserver={userName}
        transitioned={transitioned}/>);
    });

    it('animates the banner in', () =>
      expect(wrapper.find(Zoom).exists({ timeout: 500 })).toBeTruthy());

    describe('when the enter transition is complete', () => {
      beforeEach(() =>
        wrapper.find(Zoom).invoke('onEntered')());

      it('calls transitioned() with the book isbn', () =>
        expect(transitioned).toHaveBeenCalledWith(book.isbn));
    });
  });

  describe('when the reservation is being declined', () => {
    beforeEach(() => {
      state.reservations = { [book.isbn]: 'going' };
      transitioned = jest.fn();
      wrapper = mount(<ReservedBanner
        reservations={state.reservations}
        userName={state.userName}
        isbn={book.isbn}
        reserver={userName}
        transitioned={transitioned}/>);
    });

    it('animates the banner out', () =>
      expect(wrapper.find(Zoom).exists({ timeout: 500 })).toBeTruthy());

    describe('when the exit transition is complete', () => {
      beforeEach(() =>
        wrapper.find(Zoom).invoke('onExited')());

      it('calls transitioned() with the book isbn', () =>
        expect(transitioned).toHaveBeenCalledWith(book.isbn));
    });
  });

  describe('when reserved for someone else', () => {
    const otherReserver = 'Someone Else';
    beforeEach(() => {
      state = { userName: userName, reservations: { [book.isbn]: 'exists' } };
      wrapper = mount(<ReservedBanner
        reservations={state.reservations}
        userName={state.userName}
        isbn={book.isbn}
        reserver={otherReserver}/>);
    });

    it('renders a message that the reservation is for the reserver', () =>
      expect(wrapper.text()).toEqual(`Reserved for ${otherReserver}`));
  });
});