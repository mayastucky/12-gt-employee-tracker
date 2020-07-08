-- DROP DATABASE IF EXISTS employee_DB; 

-- CREATE DATABASE employee_DB; 

-- USE employee_DB; 

-- CREATE TABLE department (
--     id INT PRIMARY KEY, 
--     name VARCHAR(30) 
-- );

-- CREATE TABLE role (
--     id INT PRIMARY KEY,
--     title VARCHAR(30),
--     salary DECIMAL(10,4),
--     department_id INT
-- );

-- CREATE TABLE employee (
--     id INT PRIMARY KEY,
--     first_name VARCHAR(30),
--     last_name VARCHAR(30),
--     role_id INT, 
--     manager_id INT
-- );

-- SELECT * FROM department;
-- SELECT * FROM role; 
-- SELECT * FROM employee;

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
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id), 
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT * FROM department;
SELECT * FROM role; 
SELECT * FROM employee;

INSERT INTO department(name)
VALUES("Sales"), ("Engineering Department"), ("Product Management");

INSERT INTO role(title, salary) 
VALUES("Sales Lead", 60000), ("Salesperson", 50000), ("Software Engineer", 70000), ("UX Designer", 65000);

INSERT INTO employee(first_name, last_name)
VALUES("Adam", "Smith"), ("John", "Doe");