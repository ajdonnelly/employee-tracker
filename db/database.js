const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employee"
  });
  
  db.connect(function (err) {
    if (err) throw err;
  });
  
  module.exports = db;