INSERT INTO department (name)
VALUES ("IT"), ("Sales"), ("HR"), ("Marketing");

select * from department;
--  Create the follwoing rows in emp_roles table --

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Manager", 120000.00, 1),
("Manager", 110000.00, 2),
("Manager", 110000.00, 3),
("Manager", 110000.00, 4);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Developer", 85000.00, 1),
("Project Manager", 95000.00, 1),
("Tester", 80000.00, 1);

select * from emp_role;

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Sales Engineer", 70000.00, 2),
("Sales Lead", 65000.00, 2),
("Sales Representative", 60000.00, 2);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Admin Assistant", 50000.00, 3),
("Talent Aquisition Lead", 60000.00, 3);

INSERT INTO emp_role (title, salary, dept_id)
VALUES ("Branding Lead", 60000.00, 4),
("Market Researcher", 60000.00, 4);

--  IT department Manager Mark Zuppa  --
INSERT INTO employee (first_name, last_name, role_id)
 VALUES ("Mark", "Zuppa", 1);

INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("John", "Doe", 7, 1);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Hannah", "Montana", 5, 1);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Adam", "Cross", 5, 1);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Katy", "Perry", 6, 1);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Betty", "Crocker", 7, 1);

--   Sales department Manager April Rose  --
 
 INSERT INTO EMPLOYEE (first_name, last_name, role_id)
 VALUES ("April", "Rose", 2);

INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Amanda", "Edwards", 10, 7);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Jack", "Lee", 8, 7);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Kitty", "Grace", 9, 7);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Mathew", "Graff", 10, 7);

--  HR department Manger May Grace (empid = 12) --

INSERT INTO EMPLOYEE (first_name, last_name, role_id)
 VALUES ("May", "Grace", 3);  
 
 INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Jill", "Louise", 11, 12);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Michael", "McDonald", 12, 12);

--  Marketing  Manager Don Day (empid = 15) --

INSERT INTO EMPLOYEE (first_name, last_name, role_id)
 VALUES ("Don", "Day", 4);  

 INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Frank", "Little", 13, 15);
INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
 VALUES ("Rose", "Paris", 14, 15);

 -- SELECT --
SELECT * FROM department;
SELECT * FROM emp_role;
SELECT * FROM employee;