import { mount } from 'enzyme';
import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import Logo from './Logo';

let wrapper;

describe('on home view', () => {
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <Logo/>
      </MemoryRouter>
    );
  });

  it('renders the logo image', () =>
    expect(wrapper.exists('img[src="books_1x.svg"]')).toBeTruthy());

  it('renders the app name', () =>
    expect(wrapper.text()).toEqual('Bookdump'));

  it('does not render a link', () =>
    expect(wrapper.exists(Link)).toBeFalsy());
});

describe('on a non-home view', () => {
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/admin']}>
        <Logo/>
      </MemoryRouter>
    );
  });

  it('renders the logo image', () =>
    expect(wrapper.exists('img[src="books_1x.svg"]')).toBeTruthy());

  it('renders the app name', () =>
    expect(wrapper.text()).toEqual('Bookdump'));

  it('renders a link to home', () =>
    expect(wrapper.find(Link).prop('to')).toEqual('/'));
});