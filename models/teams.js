'use strict';

const DataModel = require('./model.js');

class Teams extends DataModel {
  constructor(file) {
    super(
      {
        id: { required: true, type: 'uuid' },
        name: { required: true, type: 'string' }
      },
      file
    );
  }
}

module.exports = Teams;
