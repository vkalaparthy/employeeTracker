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