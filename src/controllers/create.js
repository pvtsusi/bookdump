import AsyncBusboy from 'koa-async-busboy';
import { ADD_BOOK } from '../client/books';

export default {
  method: 'post',
  path: '/api/book',
  ctrl: async ({ ctx, db, io, imageStorage }) => {
    const busboy = new AsyncBusboy({
      headers: ctx.req.headers
    });
    let fileName, book = null;
    let promises = [];
    await busboy
      .onFile((fieldName, fileStream, filename, _, mimeType) => {
        if (fieldName === 'cover') {
          fileName = `${Math.round(Math.random() * 10000000)}_${filename}`;
          const uploads = imageStorage.resizeAndUpload(fileStream, fileName, mimeType);
          promises = promises.concat(uploads);
        }
      })
      .onField((fieldName, val) => {
        if (fieldName === 'metadata') {
          book = JSON.parse(val);
        }
      })
      .pipe(ctx.req);
    if (book) {
      if (fileName) {
        book.cover = `https://s3.eu-north-1.amazonaws.com/bookdump/${fileName}`;
      }
      promises.push(db.storeBook(book));
      await Promise.all(promises);
      io.emit('dispatch', { type: ADD_BOOK, book });
      ctx.status = 201;
      ctx.set('Content-Location', `/book/${book.isbn}`);
      ctx.body = book;
    } else {
      ctx.status = 400;
      ctx.body = { message: 'No book metadata' };
    }
  }
};