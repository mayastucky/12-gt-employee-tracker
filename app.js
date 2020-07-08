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
      choices: ["View Employees", "Add Employee"],
    })
    .then(function (response) {
      // console.log(response);
      if (response.startingQuestion === "View Employees") {
        showEmployees();
      } else if (response.startingQuestion === "Add Employee") {
        addEmployee();
      }
    });
}

function addEmployee() {
  console.log("Let's add an employee");
  // const arrayOfManagers
  connection.query("SELECT * FROM employee", function (err, res) {
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
        // ,
        // {
        //     type: "list",
        //     name: "manager_id",
        //     message: "Who is their manager?",
        //     choices: []
        // }
      ])
      .then(function (res) {
        console.log(res);
      });
  });
}

function showEmployees() {
  console.log("All Employees");
}
