import fs from 'fs';

const staticDir = 'build/static';
const dir = 'js';
const re = /^bundle\.[0-9a-f]{8}\.js$/;

let currentName = null;

function resolve() {
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

export default async function name() {
  if (!currentName) {
    currentName = resolve();
  }
  return currentName;
}