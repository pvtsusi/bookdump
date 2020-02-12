export default {
  method: 'get',
  path: '/api/search/:isbn',
  ctrl: async ({ctx, library}) => {
    ctx.body = await library.searchFromAll(ctx.params.isbn);
  }
}