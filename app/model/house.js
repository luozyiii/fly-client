'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const House = app.model.define('house', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(50),
    info: STRING(150),
    address: STRING(200),
    price: INTEGER,
    publishTime: DATE,
    cityCode: STRING(10),
    showCount: INTEGER(5),
    startTime: DATE,
    endTime: DATE,
  });

  return House;
};
