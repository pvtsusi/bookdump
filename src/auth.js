import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const ADMIN_TOKEN_EXPIRATION = '1h';

export class Auth {
  constructor(appSecret, nameSecret, adminName, adminPass, adminTokenExpiration = ADMIN_TOKEN_EXPIRATION) {
    this.appSecret = appSecret;
    this.nameSecret = nameSecret;
    this.adminTokenExpiration = adminTokenExpiration;
    this.adminName = adminName;
    this.adminPass = adminPass;
  }

  userSha(name, token, admin) {
    const input = admin ? name : `${token}:${name}`;
    return crypto.createHash('sha1')
      .update(this.nameSecret, 'utf8')
      .update(input, 'utf8')
      .digest('hex');
  }

  signToken(name, admin) {
    const payload = admin ? { admin: true, name: name } : { name: name };
    const options = admin ? { expiresIn: this.adminTokenExpiration } : {};
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.appSecret, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  }

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.appSecret, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }

}