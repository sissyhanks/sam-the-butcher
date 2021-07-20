const inquirer = require('inquirer');
const cTable = require('console.table');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'business'
});

connection.connect();

connection.query('SELECT * FROM role JOIN department ON role.department_id = department.id', function (error, results) {
  if (error) throw error;
  connection.connect((err) => {
    console.log(results);
  });
});