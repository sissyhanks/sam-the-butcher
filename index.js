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

mainMenu();


function mainMenu(){
  inquirer.prompt([
    {
      type:"list",
      message:"What would you like to do ?",
      name:"useroption",
      choices:["View Employees","View Roles","View Departments","Update Employee Position","View Employees by Manager","Update Employee Manager","Add Employee","Add Role","Add Department","Exit"]
    }
  ]).then(function({useroption}){
    console.log(useroption)
    switch(useroption){
      case "View Employees":
        viewEmployees();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Departments":
          viewDepartment();
          break;
      case "Add Employee":
          addEmployee();
          break;
      case "Add Role":
        adde();
        break;
      default:
          connection.end();
          process.exit(0);
    }
  })
}

function viewEmployees(){
  connection.query("SELECT e.id, e.first_name, e.last_name, d.department, r.title, r.salary FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.last_name;", function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  });
}

function viewRoles(){
  connection.query("SELECT r.title, d.department, r.salary FROM role r INNER JOIN department d ON r.department_id = d.id ORDER BY r.title;", function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  });
}

function viewDepartment(){
  connection.query("SELECT * FROM department",function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  })
}

function addEmployee(){
  connection.query("select * from role",function(err, results){
    if(err) throw err;
    let rolesDB = results.map(role => {
      return({
        value: role.id,
        name: role.title
      })
    })
    inquirer.prompt([
      {
        type:"input",
        name:"firstName",
        message:"Enter First name "
      },
      {
        type:"input",
        name:"lastName",
        message: "enter last name"
      },
      {
        type:"list",
        name:"roleid",
        message:"Choose role",
        choices: rolesDB
      },
      {
        type:"list",
        name:"managerid",
        message:"chose manager",
        choices:[
          {
            value:26,
            name:"Kwame Morales"
          },
          {
            value:28,
            name:"Saffron Lacey"

          },
          {
            value:32,
            name:"Khia Conner"
          },
          {
            value:36,
            name:"Edie Erickson"
          }
        ]
      }
    
      
    ]).then(function(response){
      console.log(response);
      connection.query("Insert into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",[response.firstName,response.lastName,response.roleid,response.managerid],function(err,data){
        if(err) throw err;
        console.table(data);
        mainMenu()
      })
    })
  })
}

function addRole(){
  connection.query("select * from department",function(err, results){
    if(err) throw err;
    let departmentDB = results.map(department => {
      return({
        value: department.id,
        name: department.department
      })
    })
    inquirer.prompt([
      {
        type:"input",
        name:"title",
        message:"Enter Title "
      },
      {
        type:"input",
        name:"salary",
        message: "enter salary"
      },
      {
        type:"list",
        name:"departmentid",
        message:"Choose department",
        choices: departmentDB
      },
      
    
      
    ]).then(function(response){
      console.log(response);
      connection.query("INSERT INTO role (title,salary,department_id) VALUES (?,?,?);",[response.title,response.salary,response.departmentid],function(err,data){
        if(err) throw err;
        console.table(data);
        mainMenu()
      })
    })
  })
}