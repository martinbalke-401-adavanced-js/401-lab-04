'use strict';

const Teams = require('./models/teams.js');
const People = require('./models/people.js');
const Validator = require('./lib/validator.js');

//Create a team and people data model based off of command line args
let people = new People(process.argv.slice(2)[0]);
let teams = new Teams(process.argv.slice(3)[0]);

/**
 * Load data takes runs at the start of program to ensure both teams
 * and people's data are populated
 */
async function loadData() {
  await people.load();
  await teams.load();
}

/**
 * Create person takes in a person object, validates it, gives it a team if none is present
 * and inserts it in to the database
 * @param {object} person - The person object you would like to add to the database
 * @returns {object} - The newly created person with their team assignment
 */
async function createPerson(person) {
  let team = await findTeam(person.team);
  if (!team.id) {
    team = await createTeam(person.team);
  }
  return await people.create({ ...person, team: team.id });
}

/**
 * Create team takes in a string and creates a team based off of that name
 * @param {string} teamName 
 */
async function createTeam(teamName) {
  if(Validator.isString(teamName)){
    return await teams.create({ name: teamName });
  }
  return 'Unable to create team';
}


/**
 * Find team checks if the value provided is of type UUID or string  it then calls teams.read()
 * with the corrosponding key:value pair
 * @param {string} val - The name or ID of a team you want to find
 * @returns {object}  - The team that was found or the boolean false
 */
async function findTeam(val) {
  let result = false;
  if (Validator.isString(val)) result = await teams.read('name', val);
  else if (Validator.isUUID(val)) result = await teams.read('id', val);
  return result;
}

/**
 * Read person searches the people database for a person based off of id
 * @param {UUID} id - The UUID you wish to search by
 * @returns {object}  - The person that was found
 */
async function readPerson(id) {
  let result = {};
  if(Validator.isUUID(id)) result = await people.read('id', id);
  console.log(result);
  return result;
}

/**
 * Update person is called whenever someone would like to change teams. If that person changes teams and their previous team is empty
 * that team is then deleted from the database
 * @param {UUID} id - UUID to search by
 * @param {string} newTeam - Name of the team they wish to switch to
 */
async function updatePerson(id, newTeam) {
  let team = await findTeam(newTeam);
  let person = await readPerson(id);
  if(Object.keys(team).length === 0) team = await createTeam(newTeam);
  await deleteTeam(person.team);
  return await people.update(id, {...person, team: team.id});
}

/**
 * Deletes a person based on their UUID. Also calls delete team in case they were the last person on the team
 * @param {*} id - UUID to search by
 * @returns {object} - The deleted person
 */
async function deletePerson(id) {
  let person = await readPerson(id);
  await deleteTeam(person.team);
  return people.delete(id);
}

/**
 * Checks the database for a team and if it has less than 2 members deletes it
 * @param {UUID} team - UUID to search by
 */
async function deleteTeam(team){
  let oldTeam = people.database.filter((player) => player.team === team);
  if (oldTeam.length < 2) teams.delete(team);
}

/**
 * Print teams console logs the current structure of the teams
 */
async function printTeams() {
  //credit to Fun Fun Function for the reduce portion of this function
  let teamMembers =  people.database
  //Map out the people and use their name to give them a full name property and a team UUID
    .map( (person) => {
      let fullName = `${person.firstName} ${person.lastName}`;
      if(!person.team) person.team = 'No team';
      return [person.team, fullName];}) 
    //Reduce the teams down in to their respective team ID's
    .reduce( (teams, players) => {
      teams[players[0]] = teams[players[0]] || [];
      teams[players[0]].push(players[1]);
      return teams;
    }, {});
  let teamslist = [];
  //Compare the team ID's on the team members array to the teams database and then push them on to a teams list array
  //with a team name instead of a team ID
  Object.entries(teamMembers).forEach((entry) =>{
    teams.database.forEach( (team) => {
      if(entry[0] === team.id) teamslist.push([team.name, entry[1]]);
    });
  });
  console.table(teamslist);
}

/**
 * Run operations completes all the neccessary steps for this lab as per the readme
 */
async function runOperations() {
  try {
    await loadData();
    let sarah = await createPerson({
      firstName: 'Sarah',
      lastName: 'Smalls',
      team: 'Yellow Rhino'});
    await readPerson(sarah.id);
    await updatePerson('aa45e212-2faa-4011-9f7e-19e18eb56f01', 'Yellow Rhino');
    await deletePerson('727c8649-3bc7-4f65-8fc6-7f5dc5333136');
    await printTeams();
  } catch (error) {
    console.error(error);
  }
}

runOperations();

