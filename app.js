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
      }
    });
}

function viewDepartment() {
  var query = "SELECT * FROM department";
  console.log("let's check out these DEPARTMENTS!");
  connection.query(query, function (err, res) {
    console.log("Departments:");
    res.forEach((department) => {
      console.log(`${department.name}`);
    });
  });
}

function showEmployees() {
  var query = "SELECT * FROM employee";
  console.log("Let's check out these super stars!");
  connection.query(query, function (err, res) {
    console.log("Employees:");
    res.forEach((employee) => {
      console.log(`${employee.first_name} ${employee.last_name}`);
    });
  });
}

function showRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    console.log("Roles");
    res.forEach((role) => {
      console.log(`${role.title}`);
    });
  });
}
function addEmployee() {
  console.log("Let's add an employee");
  // const arrayOfManagers
  const query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the new employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the new employee's last name?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What is the new employee's role?",
          choices:
            //   function () {
            //     rolesArray = [];
            //     res.forEach(function (res) {
            //       rolesArray.push(res.role_id);
            //     });
            //     return rolesArray;
            //   },
            ["Software Engineer", "UX Designer"],
        },
        {
          type: "list",
          name: "manager_id",
          message: "Who is their manager?",
          choices: ["MANAGER 1", "MANAGER 2"],
        },
      ])
      .then(function (res) {
        console.log(res);
        connection.query("INSERT INTO employee SET ?", res, function (
          err,
          res
        ) {
          if (err) throw err;
          console.log("Employee Added!");
        });
      });
  });
}
