const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employees",
    password: "8@Rot8@hiqudrl_ronld"
  });
  
  db.connect(function (err) {
    if (err) throw err;
  });
  
  module.exports = db;