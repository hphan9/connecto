import request from 'supertest';
import app from '../../app';

beforeAll(() => {
  // start the database connection
});

beforeEach(() => {
  // Clone the database connection
});

// it('should return 405 for non-post requests to the signup route',async()=>{
//     await request(app).get('/api/auth/signup').expect(405);
//     await request(app).get('/api/auth/signup').expect(405);
//     await request(app).get('/api/auth/signup').expect(405);
// });

// if email is not valid it is 412 _ semantic error
it('Should return 422 if the email is not valid', async () => {
  await request(app).post('/api/auth/signup').send({ something: 'something' }).expect(422);
});
