import AdminView from './components/admin/AdminView';
import App from './components/App';
import Books from './components/books/Books';

export default [
  {
    component: App,
    routes: [
      { path: '/admin', exact: true, component: AdminView },
      { component: Books }
    ]
  }
]