import React from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { ServerStyleSheets } from '@material-ui/core/styles';

// import serialize from 'serialize-javascript';
// import { Helmet } from 'react-helmet';
import routes from './client/src/routes';

export default (request, store, renderContext) => {
  const sheets = new ServerStyleSheets();
  const content = ReactDomServer.renderToString(
    sheets.collect(
      <Provider store={store}>
        <StaticRouter location={request.path} context={renderContext}>
          <div>{renderRoutes(routes)}</div>
        </StaticRouter>
      </Provider>
    )
  );
  const css = sheets.toString();
  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <style id="jss-server-side">${css}</style>
              <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
              <link rel="manifest" href="/site.webmanifest">
              <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
              <meta name="apple-mobile-web-app-title" content="Bookdump">
              <meta name="application-name" content="Bookdump">
              <meta name="msapplication-TileColor" content="#ffc40d">
              <meta name="theme-color" content="#ffffff">
              <link rel="shortcut icon" href="/favicon.ico" />
              <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
              />
              <meta name="theme-color" content="#000000" />
              <title>Bookdump</title>
            </head>
            <body style="overflow: hidden; position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root" style="z-index: 0; -webkit-transform:translateZ(0); overflow-y: scroll; height: 100vh; -webkit-overflow-scrolling: touch;">
                ${content}
              </div>
            </body>
          </html>`;
};