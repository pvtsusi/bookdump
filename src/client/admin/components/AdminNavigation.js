import IconButton from '@material-ui/core/IconButton';
import AdminIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

export default function AdminNavigation() {
  const location = useLocation();
  const admin = useSelector(state => state.session.authenticated && state.session.user && state.session.user.admin);
  if (!admin) {
    return null;
  }
  if (location.pathname === '/admin') {
    return (
      <Link to="/">
        <IconButton>
          <HomeIcon fontSize="large"/>
        </IconButton>
      </Link>
    );
  } else {
    return (
      <Link to="/admin">
        <IconButton>
          <AdminIcon fontSize="large"/>
        </IconButton>
      </Link>
    );
  }
}
