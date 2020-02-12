export default {
  method: 'get',
  path: '/api/books',
  ctrl: async ({ctx, db, sha, admin}) => {
    ctx.body = await db.retrieveBooks(sha, admin);
  }
}