const fs = require('fs');

exports.NotFound = {
  statusCode: 404,
  body: fs.readFileSync('./src/public/404.html', 'utf8'),
  headers: {
    'Content-Type': 'text/html',
  },
};

exports.InvalidSchema = {
  statusCode: 403,
  body: JSON.stringify({ message: 'Invalid schema' }),
  headers: {
    'Content-Type': 'application/json',
  },
};

exports.NoLoops = {
  statusCode: 403,
  body: JSON.stringify({ message: 'No loops' }),
  headers: {
    'Content-Type': 'application/json',
  },
};

exports.WrongPassword = {
  statusCode: 403,
  body: JSON.stringify({ message: 'Sorry, wrong password' }),
  headers: {
    'Content-Type': 'application/json',
  },
};
