'use strict';

module.exports = app => {
  const store = {};
  app.sessionStore = {
    async get(key) {
      console.log('---store---', store);
      return store[key];
    },
    async set(key, value, maxAge) {
      store[key] = value;
    },
    async destroy(key) {
      store[key] = null;
    },
  };
  // console.log('aaa:', app.config.coreMiddleware);
  app.config.coreMiddleware.push('auth');
};
