import cors from '@koa/cors';
import http from 'http';
import Koa from 'koa';
import basicAuth from 'koa-basic-auth';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import json from 'koa-json';
import mount from 'koa-mount';
import onerror from 'koa-onerror';
import Router from 'koa-router';
import sslify, { xForwardedProtoResolver } from 'koa-sslify';
import staticFiles from 'koa-static';
import { sessionService } from 'redux-react-session';
import configureStore from './client/configureStore';
import jsBundleName from './jsBundle';
import renderer from './renderer';
import controllers from './controllers';

const { initServerSession, loadSession } = sessionService;
const router = Router();

const jsBundlePromise = jsBundleName().catch((err) => {
  console.error(err);
  process.exit(1);
});

export default function(auth, db, getIo, imageStorage, library) {
  const app = new Koa();
  onerror(app);
  if (process.env.NODE_ENV === 'production') {
    app.use(sslify({ resolver: xForwardedProtoResolver }));
  }
  app.use(compress());
  app.use(json({}));
  app.use(cors());
  app.use(bodyParser());
  app.use(mount('/static', staticFiles(`${__dirname}/static`, { index: false })));
  app.use(mount('/', staticFiles(`${__dirname}/root`, { index: false })));

  app.use(async (ctx, next) => {
    ctx.store = configureStore();
    try {
      await initServerSession(ctx.store, ctx.request);
      const session = await loadSession();
      if (session.token) {
        try {
          ctx.state.user = await auth.verifyToken(session.token);
          ctx.state.user.sha = auth.userSha(ctx.state.user.name, session.token, ctx.state.user.admin);
        } catch (err) {
          ctx.state.authError = err;
          if (err.name === 'TokenExpiredError') {
            ctx.state.expired = true;
            ctx.set('Token-Expired', 'true');
          }
        }
      }
    } catch (sessionErr) {
      if (sessionErr !== 'Session not found') {
        throw sessionErr;
      }
    }
    return next();
  });

  for (const controller of controllers) {
    if (controller.basicAuth) {
      app.use(mount(controller.path, basicAuth({ name: auth.adminName, pass: auth.adminPass })));
    }
    router[controller.method](controller.path, async (ctx) => {
      const io = getIo();
      const jsBundle = await jsBundlePromise;
      return await controller.ctrl({
        ctx,
        db,
        io,
        library,
        imageStorage,
        jsBundle,
        renderer,
        auth,
        sha: ctx.state.user && ctx.state.user.sha,
        userName: ctx.state.user && ctx.state.user.name,
        admin: ctx.state.user && ctx.state.user.admin
      })});
  }

  app.use(router.routes());

  return http.createServer(app.callback());
}