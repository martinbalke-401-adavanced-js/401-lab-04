# LAB - 04

## Data Modeling

### Author: Martin Balke

### Links and Resources
* [submission PR](https://github.com/martinbalke-401-adavanced-js/401-lab-04/pull/2)
* [travis](https://www.travis-ci.com/martinbalke-401-adavanced-js/401-lab-04)


### Modules
#### `models.js`
##### Exports the Class Model for modeling data

###### `load() -> array`
Loads the data from provided file paths

###### `create(item) -> object`
Used to insert data in to the database

###### `read(key, val) -> object`
Reads from the database based on a key:value pairing

###### `update(id, item) -> string`
Updates an item in the database as long as it's ID is a match and the 
  the new data has been sanitized

###### `delete(id) -> string`
Deletes an item in the database when it's UUID is a match

###### `sanitize(item) -> string`
Checks an object against the schema of it's database

#### `index.js`
##### Controller for the Model class

###### `createPerson(person) -> object`
Creates a person for the people database

###### `createTeam(teamName) -> object`
Creates a team based on the string provided as a name

###### `findTeam(val) -> object`
Finds a team in the teams database

###### `readPerson(id) -> object`
Finds a person in the database based off of their ID


#### Running the app
* `npm start`
  
#### Tests
* How do you run tests?
`npm test`
* What assertions were made?
`All of the Model class CRUD operations work`
* What assertions need to be / should be made?

#### UML
Link to an image of the UML for your application and response to events