'use strict';

const { app } = require('egg-mock/bootstrap');

describe('user test', () => {
  // 同步
  it('user index', () => {
    return app.httpRequest().get('/user').expect('user index');
  });
  // 异步
  it('user lists', async () => {
    await app.httpRequest().get('/user/lists').expect(200)
      .expect('[{"id":123}]');
  });
  it('user detail', async () => {
    await app.httpRequest().get('/user/detail?id=12345').expect(200)
      .expect('12345');
  });
  it('user detail2', async () => {
    await app.httpRequest().get('/user/detail2/100').expect(200)
      .expect('100');
  });
  it('user add post', async () => {
    await app.httpRequest().post('/user/add').send({
      name: 'leslie',
      age: 18,
    })
      .expect(200)
      .expect({
        status: 200,
        data: {
          name: 'leslie',
          age: 18,
        },
      });
  });
  it('user edit put', async () => {
    await app.httpRequest().put('/user/edit').send({
      name: 'leslie',
      age: 18,
    })
      .expect(200)
      .expect({
        status: 200,
        data: {
          name: 'leslie',
          age: 18,
        },
      });
  });
  it('user del delete', async () => {
    await app.httpRequest().del('/user/del').send({
      id: '100',
    })
      .expect(200)
      .expect('100');
  });
});
