import { ADD_BOOK } from '../client/books';

export default {
  method: 'post',
  path: '/api/forget',
  ctrl: async ({ ctx, db, io, sha }) => {
    if (sha) {
      const books = await db.forgetUser(sha);
      for (const book of books) {
        io.emit('dispatch', { type: ADD_BOOK, book, origin: sha });
      }
      ctx.status = 200;
      ctx.body = { message: 'Ok' };
    } else {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
    }

  }
};