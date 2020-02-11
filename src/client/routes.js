import { AdminView } from './admin';
import { App } from './app';
import { Books } from './books';

export default [
  {
    component: App,
    routes: [
      { path: '/admin', exact: true, component: AdminView },
      { component: Books }
    ]
  }
]