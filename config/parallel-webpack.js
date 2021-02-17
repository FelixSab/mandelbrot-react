const client = require('./webpack.client');
const server = require('./webpack.server');

const config = (env) => {
  const argv = { mode: process.env.NODE_ENV };
  return [
    client(env, argv),
    server(env, argv)
  ];
}

module.exports = config;
