const Model = require('../models/model.js');
const Teams = require('../models/teams.js');
const People = require('../models/people.js');

jest.mock('fs');

let goodModel = new Model('hey', '../data/people-data.json');
let badModel = new Model('hey', '../data/bad-data.json');

describe('FS testing ', () => {
  it('Works when given a good filepath', async () => {
    const data = await goodModel.load();
    expect(typeof data).toBe('string')
    expect(data).toMatch(/ello/);
  });

  it('Fails when given a bad filepath', async () => {
    try {
      await badModel.load();
    } catch (error) {
      expect(error).toMatch(/Invalid/)
    }
  });

});

// describe('Model', () => {
//   // How might we repeat this to check on types?
//   it('sanitize() returns undefined with missing requirements', () => {});

//   it('can create', () => {});

//   it('can read', () => {});

//   it('can update', () => {});

//   it('can delete', () => {});
// });
