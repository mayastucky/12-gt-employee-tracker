const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "haloween",
  database: "employee_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // readItems();
  init();
});

//first, we need to ask the user what they want to do
//then, based on those answers, we need to run other functions

function init() {
  inquirer
    .prompt({
      name: "startingQuestion",
      type: "list",
      message: "What would you like to do today?",
      choices: [
        "View Employees",
        "Add Employee",
        "View Department",
        "View Roles",
        "Add Department",
      ],
    })
    .then(function (response) {
      // console.log(response);
      if (response.startingQuestion === "View Employees") {
        showEmployees();
      } else if (response.startingQuestion === "Add Employee") {
        addEmployee();
      } else if (response.startingQuestion === "View Department") {
        viewDepartment();
      } else if (response.startingQuestion === "View Roles") {
        showRoles();
      } else if (response.startingQuestion === "Add Department") {
        addDepartment();
      }
    });
}
//VIEW FUNCTIONS
function viewDepartment() {
  var query = "SELECT * FROM department";
  console.log("let's check out these DEPARTMENTS!");
  connection.query(query, function (err, res) {
    console.log("Departments:");
    res.forEach((department) => {
      console.table(`${department.name}`);
    });
    init();
  });
}

function showEmployees() {
  var query = "SELECT * FROM employee";
  console.log("Let's check out these super stars!");
  connection.query(query, function (err, res) {
    console.log("Employees:");
    res.forEach((employee) => {
      //   console.table(`Name: ${employee.first_name} ${employee.last_name}`);
      console.table(employee);
    });
    init();
  });
}

function showRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    console.log("Roles");
    res.forEach((role) => {
      console.table(`${role.title}`);
    });
    init();
  });
}

//END OF VIEW FUNCTIONS

// //ADD FUNCTIONS

function addEmployee() {
  console.log("Employee Added!");
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What's the name of the department you want to add?",
    })
    .then(function (response) {
      console.log(response);
      connection.query("INSERT INTO department SET ?", response, function (
        err,
        res
      ) {
        if (err) throw err;
        console.log("Department Added");
      });
      init();
    });
}
