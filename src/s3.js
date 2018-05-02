import s3 from 's3';
import uid from 'uid';

const s3Options = {
  accessKeyId: process.env.S3_AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_AWS_ACCESS_SECRET,
};
const client = s3.createClient({ s3Options });

// eslint-disable-next-line import/prefer-default-export
export const upload = localFile =>
  new Promise((resolve, reject) => {
    const fileName = `${uid(10)}.png`;
    const params = {
      localFile,

      s3Params: {
        Bucket: 'ratioed-tweets',
        Key: fileName,
        ACL: 'public-read',
      },
    };
    const uploader = client.uploadFile(params);
    uploader.on('error', err => {
      console.error('unable to upload:', err.stack);
      reject(err);
    });
    uploader.on('progress', () => {
      console.log(
        'progress',
        uploader.progressMd5Amount,
        uploader.progressAmount,
        uploader.progressTotal
      );
    });
    uploader.on('end', () => {
      console.log('done uploading');
      resolve(s3.getPublicUrlHttp(params.s3Params.Bucket, params.s3Params.Key));
    });
  });
