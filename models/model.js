'use strict';

const fs = require('fs');
const util = require('util');
const uuid = require('uuid/v4');
const validator = require('../lib/validator.js');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * class Model defines how data in the application is handled
 * @param {object} schema - this is a set of rules inside of an object to define the data
 * @param {string} file - a string which is the file location on hard drive. Provided via command line
 */
class Model {
  constructor(schema, file) {
    this.schema = schema;
    this.file = file;
    this.database = [];
  }

  /**
   * Load is a method on the class that loads the contents from this.file
   */
  async load() {
    // read the file asynchronously and save the results in
    // contents
    let contents = await readFile(this.file);

    // .then() (b/c of await)
    this.database = JSON.parse(contents.toString().trim());
    return this.database;
  }

  /**
   * Create is used to insert an object in to the database. It is given a UUID and sanitized.
   * @param {object} item - Item you wish to insert in to the database.
   * @returns {Promise<object>} - The created item.
   */
  async create(item) {
    //Adding a UUID and checking the item against the schema before adding it.
    let record = { id: uuid(), ...item };
    let isValid = this.sanitize(record);
    //If the item matches the schema type push it on to this.database and save it
    if (isValid) {
      this.database.push(record);
      await writeFile(this.file, JSON.stringify(this.database));
      //return the item that was added
      return record;
    }
    //If the item does not pass sanitizer return
    return 'Invalid schema';
  }
  /**
   * Read searches the database for a match of both key and val and returns the found item
   * @param {string} key - The key that you should search for IE 'id' or 'firstName'
   * @param {string} val  - The value in the key value pair
   * @returns {Promise<object>} -  The item that was found
   */
  async read(key, val) {

    let found = {};

    this.database.forEach(item => {
      if (item[key] === val) found = item;
    });

    return found;
  }

  /**
   * Update searches the database by ID then if there is a match updates that item
   * @param {string} id - ID to search by
   * @param {object} item - Updated object properties
   * @returns {string} - Notifies you of a successful update
   */
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

  /**
   * Delete searches the database for the provided id and then removes that item
   * @param {string} id - The id of the item you wish to search for
   */
  async delete(id) {
    let matchIndex = this.database.findIndex( (value) => value.id === id);
    if(matchIndex > -1){
      this.database.splice(matchIndex, 1);
      await writeFile(this.file, JSON.stringify(this.database));
      return 'Deleted Successfully';
    }
  }

  /**
   * Sanitize uses the validator library to check all items inserted against the this.schema
   * @param {object} item - Object you want to validate
   * @returns {boolean}
   */
  sanitize(item) {
    return validator.isValid(this.schema, item);
  }
}

module.exports = Model;
