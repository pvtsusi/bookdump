export default {
  method: 'all',
  path: '*',
  ctrl: async ({ ctx, db, sha, admin, jsBundle, renderer }) => {
    const books = await db.retrieveBooks(sha, admin);
    ctx.store.dispatch({type: 'BOOKS_VIEW_LOADED', books});

    const renderContext = {};
    const content = renderer(ctx.request, ctx.store, jsBundle, renderContext);

    if (renderContext.notFound) {
      ctx.status = 404;
    }
    ctx.body = content;
  }
};