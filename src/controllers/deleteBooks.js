export default {
  method: 'delete',
  path: '/api/user/:sha/books',
  ctrl: async ({ ctx, db, admin }) => {
    if (!admin) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden' };
      return;
    }
    if (!ctx.params.sha) {
      ctx.status = 400;
      ctx.body = { message: 'No reserver SHA given' };
      return;
    }
    await db.deleteByReserver(ctx.params.sha);
    ctx.status = 200;
    ctx.body = { message: 'Ok' };
  }
};