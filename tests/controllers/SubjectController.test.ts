import app from '../../src/app';
import request from 'supertest';

describe('SubjectController', () => {
  it('should be gets a 200 code', done => {
    request(app).get('/subjects').expect(200);
    done();
  });

  it('should be gets a 200 code', done => {
    request(app).get('/subjects/1').expect(200);
    done();
  });

  it('should be gets a 404 code', done => {
    request(app).get('/subjects/a').expect(404);
    done();
  });

  it('should be gets a 400 code', done => {
    request(app).get('/subjects/a').expect(400);
    done();
  });

  it('should be gets a 201 code', done => {
    request(app)
      .post('/subjects')
      .set('Content-Type', 'application/json')
      .send({
        id: 1,
        name: 'Math',
        credits: 5,
        code: 'math',
        slots: 10,
        availableSlots: 10,
        status: true
      })
      .expect(201);
    done();
  });
});
