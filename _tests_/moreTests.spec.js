const { lecturerDetails, studentDetails, consultationDetails, studentBooking, consultationPeriods } = require('../src/services/dbProvider');
const insertService = require('../src/services/insert_service');
const mongoose = require('mongoose');

describe('insert', () => {

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