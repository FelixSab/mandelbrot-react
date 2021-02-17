import express from 'express';
import healthCheck from './middlewares/healthCheck';
import useStaticCompression from './middlewares/useStaticCompression';

const app = express();

app.use('/health', healthCheck());
app.use(useStaticCompression());
app.use(express.static('dist/public'));

const port = 8080;
const server = app.listen(port, () => console.log(`Listening at port ${port}`));

process.on('SIGTERM', () => {
  if (server) {
    server.close();
  }

  console.log('Shutdown service...');
  process.exit(0);
});
