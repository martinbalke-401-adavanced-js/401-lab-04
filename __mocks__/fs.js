'use strict';

module.exports = exports = {};

let fileContents = ['Hello'];

exports.readFile = (file, cb) => {
  fileContents = JSON.stringify(fileContents);
  if (file.match(/bad/i)) {
    cb('Invalid File');
  } else {
    cb(undefined, new Buffer(fileContents));
  }
};
exports.writeFile = (file, buffer, cb) => {
  if (file.match(/bad/i)) {
    cb('invalid File');
  } else {
    cb(undefined, 'File Saved');
  }
};
