const fs = require('fs');

if (!fs.existsSync('./.env.development'))
  throw 'There was not development environment file found!';

if (process.env.MESSAGE !== 'Hello, Development!')
  throw 'Message environment variable is not set correctly!';
