const inquirer = require('inquirer');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'business'
});

connection.connect();

connection.query('SELECT * FROM role', function (error, results) {
  if (error) throw error;
  connection.connect((err) => {
    console.log(results);
  });
});