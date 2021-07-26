const inquirer = require('inquirer');
const cTable = require('console.table');
const CFonts = require('cfonts');

const mysql = require('mysql');

// credentials to connect to mysql server
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'business'
});

//conect to mysql server
connection.connect();

function init(){
  CFonts.say('Employee|Tracker', {
	font: 'tiny',              // define the font face
	align: 'left',              // define text alignment
	colors: ['yellowBright'],         // define all colors

	env: 'node'                 // define the environment CFonts is being executed in
});
mainMenu();
}

//starts program
// mainMenu();

//presents user with program options 
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

// retrieves data on all employees from all tables
function viewEmployees(){
  connection.query("SELECT e.eid, e.first_name, e.last_name, d.department, r.title, r.salary FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.last_name;", function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  });
}

//retrieves manager info and displays employees by manager from employee table
function viewByManager(){
  connection.query("SELECT CONCAT(m.last_name, ', ', m.first_name) AS Manager, CONCAT(e.last_name, ', ', e.first_name) AS `Direct report` FROM employee e INNER JOIN employee m ON m.eid = e.manager_id ORDER BY Manager;", function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  });
}

//retrieves role information from role and departments tables
function viewRoles(){
  connection.query("SELECT r.title, d.department, r.salary FROM role r INNER JOIN department d ON r.department_id = d.id ORDER BY r.title;", function(err, data){
    if(err) throw err;
    console.table(data);
    mainMenu();
  });
}

// this function presents the user with inquirer prompt, the choices for which are drawn from the employee and role tables
function updateRole(){
//asks for employee and role information from the database
//Both the employee id and role id were originally named id in each respective table. employee.id was returning the role id number. solved by updating employee id column name to eid
connection.query("SELECT employee.eid, employee.first_name, employee.last_name, employee.role_id, role.title, role.id FROM employee  INNER JOIN role  ON employee.role_id = role.id;", function(err, results){
    if(err) throw err;
    //creates a variable to insert into inquirer prompts that will display a list based on table data for user to chose from and builds a key value pair, of which the value to be used to manipulate tables with in inquirer response function
    let employeeChange = results.map(employee => {
      return({
        value: employee.eid,
        name: (employee.first_name + ' '+ employee.last_name)
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
      //takes in inquirer responses, uses them to make changes to database and returns to main menu prompts
      console.log(response);
      connection.query("UPDATE employee SET employee.role_id = ? WHERE employee.eid = ?;",
      [response.newRole, response.employee], 
      function(err, data){
        if(err) throw err;
        viewEmployees();
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

// function viewBudget(){
//   connection.query("SELECT department.id, department.department, role.salary, role.department_id FROM department INNER JOIN role  ON role.department_id = department.id;", function(err, results){
//     if(err) throw err;
//     let department = result.map(department => {
//       return({
//         value: department.id,
//         name: department.department
//       })
//     });
//     inquirer.prompt([
//       {
//         title:"list",
//         name:"budgetCheck",
//         message:"Which department's budget would you like to view?",
//         choices: department
//       }
//     ]),then(function(response){
//       console.log(response);
//       connection.query("")
//     })
//   })
// }

function addEmployee(){
  connection.query("SELECT role.title, role.id, null as manager_id, null as Manager FROM role UNION ALL SELECT DISTINCT null as id, null as title, employee.manager_id, CONCAT( m.first_name, + ' ', m.last_name) AS Manager FROM employee INNER JOIN employee m ON m.eid = employee.manager_id;",function(err, results){
    if(err) throw err;
    let rolesDB = results.flatMap((role) => {
      return (role.id === null) ? []: 
      [({
        value: role.id,
        name: role.title
      })];
    })
    let managerDB = results.flatMap((employee) => {
      return (employee.manager_id === null) ? []:
      [({
        value: employee.manager_id,
        name: employee.Manager
      })];
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
        choices: managerDB
      }
    
      
    ]).then(function(response){
      console.log(response);
      connection.query("Insert into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",
      [response.firstName, response.lastName, response.roleid, response.managerid],
      function(err,data){
        if(err) throw err;
        viewEmployees();
        mainMenu()
      })
    })
  })
}

function addRole(){
  connection.query("select * from department", function(err, results){
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
        viewRoles();
        mainMenu();
      })
    })
  })
}

function addDepartment(){
    inquirer.prompt([
      {
        type:"input",
        name:"newDpt",
        message:"Enter the name of the department you would like to add."
      }
    ]).then(function(response){
      console.log(response);
      connection.query("INSERT INTO department (department) VALUE (?)", [response.newDpt],
      function(err, data){
        if(err) throw err;
        viewDepartment();
        mainMenu();
      })
  })
}

init();