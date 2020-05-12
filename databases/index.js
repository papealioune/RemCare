/**=============================================================  API Initialisation =============================================================*/
/**
 * @dev 
 * @param sqlite3 oject is used for the caching for the whatsApp and sms based platforms
 * @param postGresDB object is used to access all data stored on the platform
 * 
 * 
 */

require('dotenv').config({
    path: '../config/vars.env',
    encoding: 'utf8'
  })
  //let sqlite3 = require('sqlite3').verbose();
  const {
    Pool
  } = require('pg')
  const postGresDB = new Pool({
    connectionString: process.env.CONNECTIONSTRING,
    max: 10000000
  })
  postGresDB.query('SELECT * from user', (err, res) => {
    if (!err) {
      console.log('connected to postgres DB')
    }
    else{
      console.log('pgDB err: ', err)
    }
  })
  /*let dbSqlite = new sqlite3.Database('./databases/sqlite/cache.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the caching SQlite database.');
      createTables()
    }
  });
  */

  module.exports = {
    postGresDB
  }