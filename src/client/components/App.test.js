import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SNACKBAR_ERROR, SNACKBAR_LOGGED_OUT } from '../reducers/snackbar';
import App from './App';

function MockModalProgress(props) {
  return (<div/>);
}

jest.mock('./ModalProgress', () => {
  return {
    __esModule: true,
    default: (props) => {
      return (<MockModalProgress show={props.show}/>);
    }
  };
});

function MockSnackbar(props) {
  return (<div id={props.snackbarKey}/>);
}

jest.mock('./MessageSnackbar', () => {
  return {
    __esModule: true,
    default: (props) => {
      return (<MockSnackbar snackbarKey={props.snackbarKey}/>);
    }
  };
});
jest.mock('./books/TooSlowSnackbar', () => {
  return {
    __esModule: true,
    default: () => {
      return (<MockSnackbar snackbarKey="mockTooSlowSnackbar"/>);
    }
  };
});

function MockTopBar() {
  return (<div/>);
}

jest.mock('./TopBar', () => {
  return {
    __esModule: true,
    default: () => {
      return (<MockTopBar/>);
    }
  };
});

function MockView() {
  return (<div/>);
}

const mockStore = configureMockStore([thunk]);

let store, wrapper;
const mockRoutes = [
  { exact: true, component: MockView }
];

describe('when not loading', () => {
  const loading = false;

  describe('with default mode', () => {

    beforeEach(() => {
      store = mockStore({
        progress: { loading }
      });
      wrapper = mount(
        <Provider store={store}>
          <StaticRouter location="/" context={{}}>
            <App route={{ routes: mockRoutes }}/>
          </StaticRouter>
        </Provider>
      );
    });

    it('renders with light palette theme', () =>
      expect(wrapper.find('ThemeProvider').prop('theme').palette.type).toEqual('light'));

    it('includes inactive ModalProgress', () =>
      expect(wrapper.find(MockModalProgress).prop('show')).toBeFalsy());

    it('includes logged-out snackbar', () =>
      expect(wrapper.exists(`#${SNACKBAR_LOGGED_OUT}`)).toBeTruthy());

    it('includes error snackbar', () =>
      expect(wrapper.exists(`#${SNACKBAR_ERROR}`)).toBeTruthy());

    it('includes too-slow snackbar', () =>
      expect(wrapper.exists('#mockTooSlowSnackbar')).toBeTruthy());

    it('includes the top bar', () =>
      expect(wrapper.exists(MockTopBar)).toBeTruthy());

    it('renders the router component', () =>
      expect(wrapper.exists(MockView)).toBeTruthy());

  });

  describe('with dark mode selected via property', () => {

    beforeEach(() => {
      store = mockStore({
        progress: { loading }
      });
      wrapper = mount(
        <Provider store={store}>
          <StaticRouter location="/" context={{}}>
            <App mode="dark" route={{ routes: mockRoutes }}/>
          </StaticRouter>
        </Provider>
      );
    });

    it('renders with dark palette theme', () =>
      expect(wrapper.find('ThemeProvider').prop('theme').palette.type).toEqual('dark'));
  });
});

describe('when loading', () => {
  const loading = true;

  beforeEach(() => {
    store = mockStore({
      progress: { loading }
    });
    wrapper = mount(
      <Provider store={store}>
        <StaticRouter location="/" context={{}}>
          <App route={{ routes: mockRoutes }}/>
        </StaticRouter>
      </Provider>
    );
  });

  it('includes active ModalProgress', () =>
    expect(wrapper.find(MockModalProgress).prop('show')).toBeTruthy());
});
