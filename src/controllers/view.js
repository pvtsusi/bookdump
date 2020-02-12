export default {
  method: 'get',
  path: '/api/book/:isbn',
  ctrl: async ({ ctx, db }) => {
    ctx.body = await db.retrieveBook(ctx.params.isbn);
  }
};