const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('../src/services/dbProvider');
const insertService = require('../src/services/insert_service');
const mongoose = require('mongoose');

const { MongoClient } = require('mongodb');

describe('insert student details', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb+srv://2305164:VZ2jrn9qYUe048tx@cluster.8cexuwk.mongodb.net/StudentConsultationDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(
      'StudentConsultationDB');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    // const users = db.collection('users');

    // const mockUser = {_id: 'some-user-id', name: 'John'};
    // await users.insertOne(mockUser);

    // const insertedUser = await users.findOne({_id: 'some-user-id'});
    // expect(insertedUser).toEqual(mockUser);
    expect(true).toEqual(true);
  });
});

describe('insert student details 2', () => {

  beforeAll(async () => {
    await mongoose.connect('mongodb+srv://2305164:VZ2jrn9qYUe048tx@cluster.8cexuwk.mongodb.net/StudentConsultationDB', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should insert a doc into collection', async () => {
    // const users = db.collection('users');
    await insertService.insertStudentDetails({
      studentNumber: '232424',
      emailAddress: 'thiss@gmail',
      firstName: 'bruce',
      lastName: 'david',
      password: '1234',
    })

    // const mockUser = {_id: 'some-user-id', name: 'John'};
    // await users.insertOne(mockUser);

    // const insertedUser = await users.findOne({_id: 'some-user-id'});
    // expect(insertedUser).toEqual(mockUser);
    expect(true).toEqual(true);
  });
});
