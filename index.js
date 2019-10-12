'use strict';

const Teams = require('./models/teams.js');
const People = require('./models/people.js');
const Validator = require('./lib/validator.js');


let people = new People(process.argv.slice(2)[0]);
let teams = new Teams(process.argv.slice(3)[0]);

async function loadData() {
  await people.load();
  await teams.load();
}

async function createPerson(person) {

  let team = await findTeam(person.team);
  if (!team.id) {
    team = await createTeam(person.team);
  }
  return await people.create({ ...person, team: team.id });
}
async function createTeam(teamName) {
  
  if(Validator.isString(teamName)){
    return await teams.create({ name: teamName });
  }
  return 'Unable to create team';
}



async function findTeam(val) {

  let result = false;
  if (Validator.isString(val)) result = await teams.read('name', val);
  else if (Validator.isUUID(val)) result = await teams.read('id', val);
  return result;
}

async function readPerson(id) {
  let result = {};
  if(Validator.isUUID(id)) result = await people.read('id', id);
  console.log(result);
  return result;
}

async function updatePerson(id, newTeam) {
  let team = await findTeam(newTeam);
  let person = await readPerson(id);
  if(Object.keys(team).length === 0) team = await createTeam(newTeam);
  await deleteTeam(person.team);
  return await people.update(id, {...person, team: team.id});
}

async function deletePerson(id) {
  let person = await readPerson(id);
  await deleteTeam(person.team);
  return people.delete(id);
}

async function deleteTeam(team){
  let oldTeam = people.database.filter((player) => player.team === team);
  if (oldTeam.length < 2) teams.delete(team);
}

async function printTeams() {
  //credit to Fun Fun Function for the reduce portion of this function
  let teamMembers =  people.database
    .map( (person) => {
      let fullName = `${person.firstName} ${person.lastName}`;
      if(!person.team) person.team = 'No team';
      return [person.team, fullName];}) 
    .reduce( (teams, players) => {
      teams[players[0]] = teams[players[0]] || [];
      teams[players[0]].push(players[1]);
      return teams;
    }, {});
  let teamslist = [];
  Object.entries(teamMembers).forEach((entry) =>{
    teams.database.forEach( (team) => {
      if(entry[0] === team.id) teamslist.push([team.name, entry[1]]);
    });
  });
  console.table(teamslist);
}

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

