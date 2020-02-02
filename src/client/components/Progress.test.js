import { mount } from 'enzyme';
import React from 'react';
import Progress from './Progress';

let wrapper;

describe('<Progress/>', () => {
  beforeEach(() => {
    wrapper = mount(<Progress/>);
  });

  it('renders CircularProgress centered in a Grid container', () =>
    expect(wrapper).toMatchSnapshot());
});
