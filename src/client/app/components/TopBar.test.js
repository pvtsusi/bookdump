import { mount } from 'enzyme';
import React from 'react';
import TopBar from './TopBar';

jest.mock('./Logo', () => {
  return {
    __esModule: true,
    default: () => {
      return (<div id="mockLogo"/>);
    }
  };
});

jest.mock('../../admin', () => {
  return {
    __esModule: true,
    AdminNavigation: () => {
      return (<div id="mockAdminNavigation"/>);
    }
  };
});

jest.mock('../../sessions', () => {
  return {
    __esModule: true,
    SessionPopover: () => {
      return (<div id="mockSessionPopover"/>);
    }
  };
});

let wrapper;

beforeEach(() =>
  wrapper = mount(<TopBar/>));

it('contains Logo, AdminNavigation and SessionPopover', () => {
  expect(wrapper.exists('#mockLogo'));
  expect(wrapper.exists('#mockAdminNavigation'));
  expect(wrapper.exists('#mockSessionPopover'));
});

