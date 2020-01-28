import fs from 'fs';

const staticDir = 'build/static';
const dir = 'js';
const re = /^bundle\.[0-9a-f]{8}\.js$/;

export default async function name() {
  return new Promise((resolve, reject) => {
    fs.readdir(`${staticDir}/${dir}`, (err, files) => {
      if (err) {
        return reject(err);
      }
      const match = files.find(fileName => fileName.match(re));
      if (!match) {
        return reject(new Error(`JS bundle not found in ${dir}`));
      }
      resolve(`${dir}/${match}`);
    });
  });
}