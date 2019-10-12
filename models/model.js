'use strict';

const fs = require('fs');
const util = require('util');
const uuid = require('uuid/v4');
const validator = require('../lib/validator.js');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Model {
  constructor(schema, file) {
    this.schema = schema;
    this.file = file;
    this.database = [];
  }

  // Initialize the database
  async load() {
    // read the file asynchronously and save the results in
    // contents
    let contents = await readFile(this.file);

    // .then() (b/c of await)
    this.database = JSON.parse(contents.toString().trim());
    return this.database;
  }


  async create(item) {

    let record = { id: uuid(), ...item };
    let isValid = this.sanitize(record);
    if (isValid) {
      this.database.push(record);
      await writeFile(this.file, JSON.stringify(this.database));
      return record;
    }
    return 'Invalid schema';
  }

  async read(key, val) {

    let found = {};

    this.database.forEach(item => {
      if (item[key] === val) found = item;
    });

    return found;
  }

  async update(id, item) {
    console.log(item);
    if(this.sanitize(item)){
      let match = this.database.findIndex( (person) => person.id === id);
      if (match > -1){
        this.database[match] = item;
        await writeFile(this.file, JSON.stringify(this.database));
        return 'Updated successfully';
      }
      console.error('Invalid ID provided');
    }
    console.error('Data provided does not match schema');
  }

  // CRUD: delete
  async delete(id) {
    let matchIndex = this.database.findIndex( (value) => value.id === id);
    if(matchIndex > -1){
      this.database.splice(matchIndex, 1);
      await writeFile(this.file, JSON.stringify(this.database));
      return 'Deleted Successfully';
    }
    console.error('Id does not match any instance in the database');
  }

  // Validation
  sanitize(item) {
    return validator.isValid(this.schema, item);
  }
}

module.exports = Model;
