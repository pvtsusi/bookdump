export default {
  method: 'post',
  path: '/api/login',
  ctrl: async ({ ctx, auth }) => {
    const { name, pass } = ctx.request.body;
    if (name === auth.adminName && pass === auth.adminPass) {
      const adminToken = await auth.signToken(name, true);
      ctx.status = 200;
      ctx.body = { token: adminToken, name, admin: true, sha: auth.userSha(name, adminToken, true) };
    } else if (name && !pass) {
      const token = await auth.signToken(name);
      ctx.body = { token, name, sha: auth.userSha(name, token) };
    } else {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
    }
  }
};