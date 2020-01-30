import fs from 'fs';

const buildDir = 'build';
const dir = 'static/js';
const re = /^bundle\.[0-9a-f]{8}\.js$/;

let currentName = null;

function resolve() {
  return new Promise((resolve, reject) => {
    fs.readdir(`${buildDir}/${dir}`, (err, files) => {
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