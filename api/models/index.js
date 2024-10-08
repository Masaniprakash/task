'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { isNull } = require('../service/util.service');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'testlive';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (!isNull(config) && config.use_env_var1iable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    define: {
      timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes) 
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync().then(x => {
  console.log("db connected!.");
}).catch(e => {
  console.log("something wrong to connect db!.",e.message);
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;