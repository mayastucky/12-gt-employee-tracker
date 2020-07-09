DROP DATABASE IF EXISTS employee_DB; 

CREATE DATABASE employee_DB; 

USE employee_DB; 

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(30) 
);


CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,4),
    department_id INT,
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT,
    
    FOREIGN KEY (role_id) 
    REFERENCES role(id), 
    
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
);



SELECT * FROM department;
SELECT * FROM role; 
SELECT * FROM employee;

INSERT INTO department(name)
VALUES("Sales"), ("Engineering Department"), ("Product Management");

INSERT INTO role(title, salary, department_id) 
VALUES("Sales Lead", 60000, 1), ("Salesperson", 50000, 1), ("Software Engineer", 70000, 2), ("UX Designer", 65000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Adam", "Smith",1, 1), ("John", "Doe",2,  2),("blah", "blah", 3, 1);

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id; 