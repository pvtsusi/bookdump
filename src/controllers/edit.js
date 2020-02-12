import { PATCH_BOOK } from '../client/books';

export default {
  method: 'patch',
  path: '/api/book/:isbn',
  ctrl: async ({ctx, db, io, admin}) => {
    if (!admin) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden' };
      return;
    }
    const book = await db.retrieveBook(ctx.params.isbn);
    const patch = ctx.request.body;
    const patched = { ...book, ...patch };
    await db.storeBook(patched);
    io.emit('dispatch', { type: PATCH_BOOK, isbn: book.isbn, patch });
    ctx.set('Content-Location', `/api/book/${patched.isbn}`);
    ctx.status = 200;
    ctx.body = { message: 'Ok' };
  }
}