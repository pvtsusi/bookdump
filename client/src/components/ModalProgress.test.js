import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import React from 'react';
import ModalProgress from './ModalProgress';
import { mount } from 'enzyme';
import Progress from './Progress';

it('contains modal Backdrop as well as Progress', () => {
  const wrapper = mount(<ModalProgress show={true}/>);
  expect(wrapper.exists(Backdrop)).toBeTruthy();
  expect(wrapper.exists(Progress)).toBeTruthy();
});
