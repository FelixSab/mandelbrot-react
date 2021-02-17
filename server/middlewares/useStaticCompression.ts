import expressStaticGzip from 'express-static-gzip';

export default () =>
  expressStaticGzip('dist/public', {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
  });
