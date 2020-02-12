import AWS from 'aws-sdk';
import sharp from 'sharp';
import stream from "stream";
import resizedName from './client/cover';

const DIMENSIONS = [810, 540, 270, 120, 80, 40];

export default class ImageStorage {
  constructor(bucket, region) {
    this.bucket = bucket;
    this.region = region;
  }

  async resizeAndUpload(fileStream, fileName, mimeType, dims = DIMENSIONS) {
    const resizer = sharp();
    const promises = [];
    for (const dim of dims) {
      promises.push(new Promise((resolve, reject) =>
        resizer.clone().resize(dim, dim, { fit: sharp.fit.inside })
          .pipe(this.upload(resizedName(fileName, `${dim}`), mimeType, resolve, reject))));
    }
    fileStream.pipe(resizer);
    return promises;
  }

  upload(name, mimeType, resolve, reject) {
    const pass = new stream.PassThrough();
    const params = { Bucket: this.bucket, ACL: 'public-read' };
    const s3 = new AWS.S3({ params, region: this.region });
    s3.upload({ Body: pass, Key: name, ContentType: mimeType }, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
    return pass;
  }


}