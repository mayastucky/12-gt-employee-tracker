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
        "View Department",
        "View Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
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
      } else if (response.startingQuestion === "Add Role") {
        addRoles();
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

// function showEmployees() {
//   var query =
//     "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id; ";
//   console.log("Let's check out these super stars!");
//   connection.query(query, function (err, res) {
//     console.log("Employees:");
//     // res.forEach((employee) => {
//     // console.table(`Name: ${employee.first_name} ${employee.last_name} Role: ${role.title}`);
//     console.table(res);
//     // });
//     init();
//   });
// }

//leif fixed this don't touch it!!!!!!!!!!
function showEmployees() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";
  console.log("Let's check out these super stars!");
  connection.query(query, function (err, res) {
    console.log("Employees:");
    res.forEach((employee) => {
      // console.table(`Name: ${manager.first_name} ${employee.last_name}`);
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

// https://github.com/cibellem/employee_tracker/

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    const arrayOfRoles = res.map((roles) => roles.title);
    inquirer
      .prompt([
        //FIRST NAME
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        //LAST NAME
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        //ROLE
        {
          type: "list",
          choices: arrayOfRoles,
          name: "role_id",
        },
        //MANAGER
        // {
        //   name: "list",
        //   type: "list",
        //   message: "Who is their manager?",
        // },
      ])
      .then(function (res) {
        console.log(res);
      });
  });
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

function addRoles() {
  //we are selecting department because we want to show the array of departments
  connection.query("SELECT * FROM department", function (err, res) {
    const arrayOfDepartments = res.map((department) => department.name);
    // console.log(arrayOfDepartments);
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the new role?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          message: "In which department is this new role?",
          name: "department_name",
          choices: arrayOfDepartments,
        },
      ])
      .then(function (userChoice) {
        const department = userChoice.department_name;
        connection.query("SELECT * FROM department", function (err, res) {
          if (err) throw err;
          //matches the department name from selection to db department name
          let matchedDepartment = res.filter(function (res) {
            return res.name == department;
          });
          let id = matchedDepartment[0].id;
          //now we need to inject these roles
          connection.query(
            "INSERT INTO role(title, salary, department_id VALUES (?, ?, ?)",
            [userChoice.title, parseInt(userChoice.salary), id],
            function (err, res) {
              if (err) throw err;
              console.log("Role added successfully!");
            }
          );
        });

        console.log(userChoice);
      });
  });
}
