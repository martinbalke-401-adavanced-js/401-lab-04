'use strict';

const fs = require('fs');
const util = require('util');
const uuid = require('uuid/v4');
// const validator = require('../lib/validator.js');

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

  // CRUD: create
  async create(item) {
    // item = the new object we're gonna write to our database

    // first, check that item is the right format
    // check it matches the schema
    // all the required fields are there
    // all the fields are of the right type
    // ... is the spread operator
    // it expands the contents of the variable so that
    // you can copy it into another object/array

    let record = { id: uuid(), ...item };
    let isValid = this.sanitize(item);

    if (isValid) {
      // let's create the thing!
      // first, add it to our local database object
      this.database.push(record);

      // write my changed database back to the file
      await writeFile(this.file, JSON.stringify(this.database));

      return record;
    }

    return 'Invalid schema';
  }

  // CRUD: read / search - we don't know if it exists
  async read(key, val) {
    // go through this.database array
    // if the object at this.database[indx] has a key
    // val pair that matches the parameter val
    // return that object

    let found = {};

    // this is optional, but recommended
    // in case you forgot to load, made some
    // change and didn't update this.database, etc
    await this.load();

    this.database.forEach(item => {
      if (item[key] === val) found = item;
    });

    return found;
  }

  // CRUD: update - you usually only update something that exists
  // if something exists, it has an id
  async update(id, item) {
    // change a piece of the data
    // change data where data.id === id
    // [async] write data to file
    // make sure your change is in this.database
    // write this.database to file
  }

  // CRUD: delete
  async delete(id) {
    // find this.database object where object.id === id (forEach??)
    // remove that object (map??)
    // [async] write the new (smaller) this.database to the file
  }

  // Validation
  sanitize(item) {
    // do something to check that item is valid
    // against this.schema

    return true;
  }
}

module.exports = Model;
