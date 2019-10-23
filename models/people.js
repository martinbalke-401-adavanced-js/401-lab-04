'use strict';

const Model = require('./model.js');

/**
 * Class People extends the model and provieds a schema or set of rules for the
 * data to follow
 */
class People extends Model {
  constructor(file) {
    super(
      {
        id: { required: true, type: 'uuid' },
        firstName: { required: true, type: 'string' },
        lastName: { required: true, type: 'string' },
        team: { type: 'uuid' },
      },
      file
    );
  }
}

module.exports = People;
