import { mount } from 'enzyme';
import React from 'react';
import Button from './Button';

let wrapper;

describe('<Button/>', () => {
  describe('with default props', () => {
    beforeEach(() => {
      wrapper = mount(<Button>Label</Button>);
    });

    it('renders Material-UI Button with type=button, color=primary, variant=text and content "Label"', () =>
      expect(wrapper).toMatchSnapshot());
  });

  describe('with type=submit', () => {
    beforeEach(() => {
      wrapper = mount(<Button type="submit">Label</Button>);
    });

    it('renders Material-UI Button with type=submit', () =>
      expect(wrapper).toMatchSnapshot());
  });

  describe('with color=secondary', () => {
    beforeEach(() => {
      wrapper = mount(<Button color="secondary">Label</Button>);
    });

    it('renders Material-UI Button with color=secondary', () =>
      expect(wrapper).toMatchSnapshot());
  });

  describe('with variant=outlined', () => {
    beforeEach(() => {
      wrapper = mount(<Button variant="outlined">Label</Button>);
    });

    it('renders Material-UI Button with variant=outlined', () =>
      expect(wrapper).toMatchSnapshot());
  });

  describe('with disableRipple', () => {
    beforeEach(() => {
      wrapper = mount(<Button disableRipple={true}>Label</Button>);
    });

    it('renders Material-UI Button with disableRipple set', () =>
      expect(wrapper).toMatchSnapshot());
  });

  describe('with onClick set', () => {
    const onClick = jest.fn();
    beforeEach(() => {
      wrapper = mount(<Button onClick={onClick}>Label</Button>);
    });

    describe('clicking the button', () => {
      beforeEach(() =>
        wrapper.find(Button).simulate('click'));

      it('calls the onClick function', () =>
        expect(onClick).toHaveBeenCalled());
    });
  });

  describe('with fullWidth property set', () => {
    beforeEach(() => {
      wrapper = mount(<Button fullWidth={true}>Label</Button>);
    });

    it('renders Material-UI Button with fullWidth property set', () =>
      expect(wrapper).toMatchSnapshot());
  });
});