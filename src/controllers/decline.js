import { ADD_BOOK } from '../client/books';

export default {
  method: 'post',
  path: '/api/book/:isbn/decline',
  ctrl: async ({ ctx, db, io, sha, userName, admin }) => {
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
    const book = await db.declineBook(ctx.params.isbn, userName, sha, admin);
    io.emit('dispatch', { type: ADD_BOOK, book, origin: sha });
    ctx.status = 200;
    ctx.body = { message: 'Ok' };

  }
};