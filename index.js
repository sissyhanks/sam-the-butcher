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

connection.query('SELECT * FROM role JOIN department ON role.department_id = department.id JOIN employee ON role.id = employee.role_id', function (error, results) {
  if (error) throw error;
  connection.connect((err) => {
    console.log("welcome to my tracker!")
    console.table(results);
    mainMenu();
  });
});


function mainMenu(){
  inquirer.prompt([
    {
      type:"list",
      message:"What would you like to do ?",
      name:"useroption",
      choices:["View Department","View Positions","View Employee","Exit"]
    }
  ]).then(function({useroption}){
    console.log(useroption)
    switch(useroption){
      case "View Department":
          viewDepartment();
          break;
      default:
          connection.end();
          process.exit(0);
    }
  })
}

function viewDepartment(){
  connection.query("SELECT * FROM department",function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu()
  })
}