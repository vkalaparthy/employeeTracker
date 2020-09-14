DROP DATABASE IF EXISTS company_DB;

CREATE DATABASE company_DB;

USE company_DB;

CREATE TABLE department (
 -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  deptid INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(30) NOT NULL,
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (deptid)
);

CREATE TABLE emp_role (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "title" which cannot contain null --
  title VARCHAR(30) NOT NULL,
  -- Makes a coloum called "salary" for role which holds decimal value  which is not null --
  salary DECIMAL(6, 2) NOT NULL,
  -- Makes a column called "dept_id" to store the foreign key,  department's id from table department --
  dept_id INT,
  CONSTRAINT fk_dept
    FOREIGN KEY (dept_id)
		REFERENCES department(deptid),
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  empid INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "first_name" which cannot contain null --
  first_name VARCHAR(30) NOT NULL,
  -- Makes a string column called "last_name" which cannot contain null --
  last_name VARCHAR(30) NOT NULL,
  -- Makes a column called "role_id" to store the information of role's id from table emp_role --
  role_id INT(11) NOT NULL,
  -- Makes a column called "manager_id" to store a foreign key information of another employee rom table employee --
  manager_id INT,
  CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
		REFERENCES employee(empid),
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (empid)
);

SELECT * FROM department;
SELECT * FROM emp_role;
SELECT * FROM employee;

-- Created the follwoing department --
INSERT INTO department (name)
VALUES ("IT"), ("Sales"), ("HR"), ("Marketing");

--  Created the follwoing rows in emp_roles table --

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Manager", "120000.00", 1),
("Manager", "110000.00", 2),
("Manager", "110000.00", 3),
("Manager", "110000.00", 4);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Developer", "85000.00", 1),
("Project Manager", "95000.00", 1),
("Tester", "80000.00", 1);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Sales Engineer", "70000.00", 2),
("Sales Lead", "65000.00", 2),
("Sales Representative", "60000.00", 2);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Admin Assistant", "50000.00", 3),
("Talent Aquisition Lead", "60000.00", 3);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Branding Lead", "60000.00", 4),
("Market Researcher", "60000.00", 4);


--------------- IT department ----------
INSERT INTO employee (first_name, last_name, role_id)
 VALUES ("Mark", "Zuppa", 1);

INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Hannah", "Montana", 5, 1);

INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Adam", "Cross", 5, 1);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Katy", "Perry", 6, 1);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Betty", "Crocker", 7, 1);

--------------------  Sales department ------------
 
 INSERT INTO EMPLOYEE (first_name, last_name, role_id)
 VALUES ("April", "Rose", 2);
 INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Jack", "Lee", 8, 7);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Kitty", "Grace", 9, 7);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Mathew", "Graff", 10, 7);

------------------------------- HR department ---------------

INSERT INTO EMPLOYEE (first_name, last_name, role_id)
 VALUES ("May", "Grace", 3);  
 

 INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Jill", "Louise", 11, 12);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Michael", "McDonald", 12, 12);

--------------------------  Marketing  -----------------

INSERT INTO EMPLOYEE (first_name, last_name, role_id)
 VALUES ("Don", "Day", 4);  

 ------  Manager id is 15 -------

 INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Frank", "Little", 13, 15);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Rose", "Paris", 14, 15);

SELECT * FROM employee;