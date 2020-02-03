import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import React from 'react';
import ModalProgress from './ModalProgress';
import { mount } from 'enzyme';
import Progress from './Progress';

let wrapper;

describe('when shown', () => {
  beforeEach(() => {
    wrapper = mount(<ModalProgress show={true}/>);
  });
  it('contains modal Backdrop as well as Progress', () => {
    expect(wrapper.exists(Backdrop)).toBeTruthy();
    expect(wrapper.exists(Progress)).toBeTruthy();
  });
});

describe('when not shown', () => {
  beforeEach(() => {
    wrapper = mount(<ModalProgress show={false}/>);
  });
  it('does not render anything', () =>
    expect(wrapper.isEmptyRender()).toBeTruthy());
});