import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import openSocket from 'socket.io-client';
import { isValidSession, sessionValidated } from '../reducers/socket';
import { loggedOut, logout } from '../sessions';

export default function WebSocketManager() {
  const dispatch = useDispatch();
  const admin = useSelector(state => state.session.authenticated && state.session.user && state.session.user.admin);
  const userSha = useSelector(state => state.session.user && state.session.user.sha);

  const socket = useRef(null);
  useEffect(() => {
    if (!socket.current) {
      socket.current = openSocket('/');
    }
    return () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
  }, []);

  const interval = useRef(0);
  useEffect(() => {
    if (!interval.current) {
      interval.current = setInterval(() =>
          dispatch(isValidSession({ socket: socket.current })),
        5000);
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = 0;
      }
    };
  }, [dispatch]);

  useEffect(() => {
    socket.current.on('session_validated', data => {
      if (!data.valid) {
        dispatch(logout(admin));
        dispatch(loggedOut());
      }
      dispatch(sessionValidated());
    });
    return () => {
      if (socket.current) {
        socket.current.off('session_validated');
      }
    };
  }, [dispatch, admin]);

  useEffect(() => {
    socket.current.on('dispatch', action => {
      if (!action.origin || !userSha || action.origin !== userSha) {
        dispatch(action);
      }
    });
    return () => {
      if (socket.current) {
        socket.current.off('dispatch');
      }
    };
  }, [dispatch, userSha]);

  return (
    <React.Fragment/>
  );
}
