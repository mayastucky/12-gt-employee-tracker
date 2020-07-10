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
        "Update Employee",
        "Quit",
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
      } else if (response.startingQuestion === "Update Employee") {
        updateEmployee();
      } else if (response.startingQuestion === "Quit") {
        endApp();
      }
    });
}
//VIEW FUNCTIONS
function viewDepartment() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    console.log("Departments:");
    res.forEach((department) => {
      console.table(`${department.name}`);
    });
    init();
  });
}

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

//ADD FUNCTIONS

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    const arrayOfRoles = res.map((roles) => roles.title);
    //NEED QUERY IN A QUERY TO GET EMPLOYEES!
    connection.query("SELECT * FROM employee", function (err, resEmployee) {
      const arrayOfEmployees = resEmployee.map(
        // (employee) => employee.first_name + " " + employee.last_name
        ({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        })
      );

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
            name: "roleTitle",
          },
          //MANAGER
          {
            name: "managerName",
            type: "list",
            message: "Who is their manager?",
            choices: arrayOfEmployees,
          },
        ])
        .then(function (answer) {
          //need to grab their manager's last name and link it to their ID and insert all that information into employee
          // console.log(res);
          //create new object
          let newEmployeeId = {};
          for (let i = 0; i < res.length; i++) {
            if (res[i].title === answer.roleTitle) {
              newEmployeeId = res[i];
            }
          }
          let selectedManager = {};
          for (let i = 0; i < resEmployee; i++) {
            if (resEmployee.id === answer.managerName) {
              selectedManager = resEmployee[i];
            }
          }
          const { first_name, last_name } = answer;
          // const query =
          //   "INSERT INTO employee SET";
          // let values = [
          //   answer.first_name,
          //   answer.last_name,
          //   newEmployeeId,
          //   selectedManager,
          // ];
          // console.log("values", values);
          connection.query(
            "INSERT INTO employee SET?",
            {
              first_name: first_name,
              last_name: last_name,
              role_id: newEmployeeId.id,
              manager_id: selectedManager.id,
            },
            function (err, res) {
              if (err) throw err;
              console.log("You have added your new employee!");
              init();
              // console.log(res);
            }
          );
        });
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
            "INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)",
            [userChoice.title, parseInt(userChoice.salary), id],
            function (err, res) {
              if (err) throw err;
              console.log("Role added successfully!");
            }
          );
        });
        init();
        // console.log(userChoice);
      });
  });
}

// END OF ADD FUNCTIONS

//https://github.com/jonathanjwatson/star-fleet-academy/, https://github.com/cibellem/employee_tracker/  and https://github.com/abbyblachman/node-mysql-employee-tracker are helpful for addEmployee and updateEmployee functions!!!!!!

function updateEmployee() {
  console.log("Please select the employee you would like to update:");
  connection.query("SELECT * FROM employee", function (err, res) {
    // console.log("We are in the query!!!!!!!!!!");
    const arrayOfEmployees = res.map(
      // (employee) => employee.first_name + " " + employee.last_name
      (employee) => employee.last_name
    );
    const arrayOfRoles = res.map((role) => role.title);
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedEmployee",
          message:
            "Select the employee whose information you'd like to update (by last name)",
          choices: arrayOfEmployees,
        },
      ])
      .then(function (res) {
        console.log(res);
        //need to store the selected name so we can grab the info
        const name = res.selectedEmployee;
        connection.query("SELECT * FROM role", function (err, res) {
          const arrayOfRoles = res.map((roles) => roles.title);
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "Select their new role:",
                choices: arrayOfRoles,
              },
            ])
            .then(function (res) {
              console.log(res);
              console.log("You have successfully updated your employee.");
              const role = res.role;
              connection.query(
                //   //now we grab allllll the information from the new role they selected
                "SELECT * FROM role WHERE title = ?",
                [role],
                function (err, res) {
                  if (err) throw err;
                  // console.log("In the first query", res);
                  //NOW WE NEED TO TAKE THE ID OF THAT ROLE AND ASSIGN IT TO THE PERSON
                  role_id = res[0].id;
                  //NOW WE UPDATE
                  connection.query(
                    "UPDATE employee SET role_id = ? WHERE last_name = ?",
                    [role_id, name],
                    function (err, res) {
                      if (err) throw err;
                      //console.log(
                      // "You have successfully updated your employee."
                      //);
                    }
                  );
                  init();
                }
              );
            });
        });
      });
  });
}

function endApp() {
  console.log("Come back soon!");
  connection.end();
}
