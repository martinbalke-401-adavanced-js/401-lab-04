'use strict';

const Model = require('./model.js');

class People extends Model {
  constructor(file) {
    super(
      {
        id: { required: true, type: 'uuid' },
        firstName: { required: true, type: 'string' },
        lastName: { required: true, type: 'string' },
        team: { type: 'uuid' }
      },
      file
    );
  }

  // nothing
}

module.exports = People;
