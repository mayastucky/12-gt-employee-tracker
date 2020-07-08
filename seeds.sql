DROP DATABASE IF EXISTS employee_DB; 

CREATE DATABASE employee_DB; 

USE employee_DB; 

CREATE TABLE department (
    id INT PRIMARY KEY, 
    name VARCHAR(30) 
);

CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,4),
    department_id INT
);

CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT
);

SELECT * FROM department;
SELECT * FROM role; 
SELECT * FROM employee;