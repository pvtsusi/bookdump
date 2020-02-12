import { HIDE_BOOK } from '../client/books';

export default {
  method: 'post',
  path: '/api/book/:isbn/reserve',
  ctrl: async ({ ctx, db, io, sha, userName }) => {
    if (!userName) {
      ctx.status = 401;
      ctx.body = { message: 'User not recognized' };
      return;
    }
    if (!ctx.params.isbn) {
      ctx.status = 400;
      ctx.body = { message: 'No ISBN given' };
      return;
    }
    await db.reserveBook(ctx.params.isbn, userName, sha);
    io.emit('dispatch', { type: HIDE_BOOK, isbn: ctx.params.isbn, origin: sha });
    ctx.status = 200;
    ctx.body = { name: userName };
  }
};