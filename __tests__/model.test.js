'use strict';
const Model = require('../models/model.js');

jest.mock('fs');

let goodModel = new Model({
  firstName: { required: true, type: 'string' },
  lastName: { required: true, type: 'string' },
}, '../data/people-data.json');

let badModel = new Model('hey', '../data/bad-data.json');

describe('FS testing ', () => {
  it('Works when given a good filepath', async () => {
    const data = await goodModel.load();
    expect(typeof data[0]).toBe('string');
    expect(data[0]).toMatch(/ello/);
  });

  it('Fails when given a bad filepath', async () => {
    try {
      await badModel.load();
    } catch (error) {
      expect(error).toMatch(/Invalid/);
    }
  });

});

const goodData = {
  firstName: 'Sarah',
  lastName: 'Smalls',
  team: 'Yellow Rhino',
};

const badData = {
  lastName: 'Smalls',
  team: 'Yellow Rhino',
};

describe('Model', () => {
  
  it('sanitize() returns false with missing requirements', async (done) => {
    let data = await goodModel.sanitize(badData);
    expect(data).toBeFalsy();
    done();
  });
  it('sanitize() returns true with correct requirements', async (done) => {
    let data = await goodModel.sanitize(goodData);
    expect(data).toBeTruthy();
    done();
  });

  it('Create returns Invalid Schema when given wrong data type', async (done) => {
    let data = await goodModel.create(badData);
    expect(data).toMatch(/Invalid/);
    done();
  });

  it('Create returns an Object when given good data type', async (done) => {
    let data = await goodModel.create(goodData);
    expect(typeof data).toBe('object');
    done();
  });


  it('Read returns an empty object when given wrong key or val', async function(done) {
    let data = await goodModel.read('sandwich', 'reuben');
    expect(Object.keys(data).length === 0).toBeTruthy();
    done();
  });
  
  it('Read returns an non empty object when given correct key or val', async function(done) {
    let data = await goodModel.read('firstName', 'Sarah');
    expect(data.firstName).toBe('Sarah');
    done();
  });

  it('Model.update throws an error alerting the user of an improper schema', async (done) => {
    try {
      await goodModel.update('321i31', badData);
    } catch (error) {
      expect(error).toMatch(/Data provided does not match schema/);
    }
    done();
  });
  
  it('Model.update throws an error alerting the user of an improper ID', async (done) => {
    try {
      await goodModel.update('321i31', goodData);
    } catch (error) {
      expect(error).toMatch(/Invalid ID provided/);
    }
    done();
  });
  
  it('Model.update correctly updates when given a proper ID and schema', async (done) => {
    let data = await goodModel.update(goodModel.database[1].id, goodData);
    expect(data).toBe('Updated successfully');
    done();
  });

  it('Delete returns an string showing an item was deleted when given the proper ID parameter', async (done) => {
    let id = goodModel.database[1].id;
    let data = await goodModel.delete(id);
    expect(data).toMatch(/Deleted/);
    done();
  });
  it('Delete returns an error when given an improper ID parameter', async (done) => {
    let id = '81930190231-sdasda-121313';
    try {
      await goodModel.delete(id);
    } catch (error) {
      expect(error).toMatch(/Id does/);
    }
    done();
  });
});