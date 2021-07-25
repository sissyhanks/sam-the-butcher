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
      choices:["View Employees","View Employees by Manager","View Roles","Update Employee Role","View Departments","View the total utilized budget of a department","Update Employee Position","Update Employee Manager","Add Employee","Add Role","Add Department","Exit"]
    }
  ]).then(function({useroption}){
    console.log(useroption)
    switch(useroption){
      case "View Employees":
        viewEmployees();
        break;
      case "View Employees by Manager":
        viewByManager();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "Update Employee Role":
        updateRole();
        break;
      case "View Departments":
        viewDepartment();
        break;
      case "View the total utilized budget of a department":
        viewBudget();
      case "Add Employee":
        addEmployee();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Delete Employee":
        deleteEmployee();
        break;
      case "Delete Role":
        deleteRole();
        break;
      case "Delete Department":
        deleteDepartment();
        break;
      default:
        connection.end();
        process.exit(0);
    }
  })
}

function viewEmployees(){
  connection.query("SELECT e.eid, e.first_name, e.last_name, d.department, r.title, r.salary FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.last_name;", function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  });
}

function viewByManager(){
  connection.query("SELECT CONCAT(m.last_name, ', ', m.first_name) AS Manager, CONCAT(e.last_name, ', ', e.first_name) AS `Direct report` FROM employee e INNER JOIN employee m ON m.eid = e.manager_id ORDER BY Manager;", function(err, data){
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

function updateRole(){
connection.query("SELECT employee.eid, employee.first_name, employee.last_name, employee.role_id, role.title, role.id FROM employee  INNER JOIN role  ON employee.role_id = role.id;", function(err, results){
    if(err) throw err;
    let employeeChange = results.map(employee => {
      return({
        value: employee.eid,
        name: (employee.first_name + ' '+ employee.last_name + ' ' + employee.eid)
      })
    });
    let newRole = results.map(role => {
      return({
        value: role.id,
        name: role.title
      })
    });
    inquirer.prompt([
      {
        type:"list",
        name:"employee",
        message: "Who's role would you like to update?",
        choices: employeeChange
      },
      {
        type:"list",
        name:"newRole",
        message:"What role would you like to move them into?",
        choices: newRole
      }
    ]).then(function(response){
      console.log(response);
      connection.query("UPDATE employee SET employee.role_id = ? WHERE employee.eid = ?;",
      [response.newRole, response.employee], 
      function(err, data){
        if(err) throw err;
        console.table(data);
        mainMenu()
      })
    })
  })
}

function viewDepartment(){
  connection.query("SELECT department FROM department;",function(err, data){
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
      connection.query("Insert into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",
      [response.firstName, response.lastName, response.roleid,response.managerid],
      function(err,data){
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