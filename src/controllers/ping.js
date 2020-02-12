export default {
  method: 'get',
  path: '/api/test',
  basicAuth: true,
  ctrl: async ({ ctx, db, admin }) => {
    ctx.status = 200;
    ctx.body = { message: 'Ok' };
  }
};