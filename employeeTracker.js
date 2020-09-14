const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const showBanner = require("node-banner");

// Open a connection
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "12345678",
    database: "company_DB"
});

// connect to the mysql server and sql database
connection.connect(err => {
    if (err) {
        throw err;
    }
    console.log(`connected as id ${connection.threadId}`);
    (async () => {
        await showBanner("Employee Tracker");
        init();
    })();
});

// This function will prompts the user for what they want to do when this application starts
function init() {
    console.log("\n");
    inquirer.prompt ({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: ["View All employees", "View employees by Manager", 
      "View all Departments", "View all roles", "Add a Department", 
      "Add a role", "Add an employee", "Update employee role", "Exit"]
    })
    .then (function(response) {
        switch(response.choice) {
            case "View All employees":
                viewAllEmployees();
                break;
            case "View employees by Manager":
                viewEmpByMgr();
                break;
            case "View all Departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            default:
                connection.end();
        }
    })
};

// function that will show all departments to the user from the db table department
function viewAllDepartments() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\n--------------------------------------------------");
        const table = cTable.getTable(res);
        console.log(table);
        // Go back to prompt user 
        init();
    });
};

// function that will show all roles to the user
function viewAllRoles() {
    const query = "SELECT title, salary, name FROM emp_role INNER JOIN department ON dept_id = deptid";
    connection.query(query, function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\n--------------------------------------------------");
        const table = cTable.getTable(res);
        console.log(table);
        // Go back to prompt user 
        init();
    });
};

// function that will show all employees to the user
function viewAllEmployees() {
   let query = "SELECT empid, first_name, Last_name, title, salary, name AS department FROM employee ";
   query += "INNER JOIN emp_role ON role_id = id INNER JOIN department ON dept_id = deptid";
    connection.query(query, function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\n--------------------------------------------------");
        const table = cTable.getTable(res);
        console.log(table);
        // Go back to prompt user 
        init();
    });
};

// This function will show the employees based on a chosen Manager
function viewEmpByMgr() {
    //console.log("viewEmpByDept");
    // Go back to prompt user
    let query = "SELECT empid, first_name, last_name FROM employee INNER JOIN emp_role ON role_id = id WHERE title = ?";
    connection.query(query, ["Manager"], function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                const choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].first_name + " " + results[i].last_name);
                }
                return choiceArray;
              },
              message: "Choose a Manager"
            }
        ])
        .then((answer) => { 

            let manager_id;
            for (var i = 0; i < results.length; i++) {
                if (answer.choice === results[i].first_name + " " + results[i].last_name) {
                    manager_id = results[i].empid;
                }
            }
            query = "SELECT empid, first_name, Last_name, title FROM employee ";
            query += "INNER JOIN emp_role ON role_id = id INNER JOIN department ON dept_id = deptid "
            query += "WHERE manager_id = ?";
            //console.log(manager_id);
            connection.query(query, [manager_id], (err, res) => {
                if (err) throw err;
                //console.log(query);
                console.log("\n--------------------------------------------------");
                const table = cTable.getTable(res);
                console.log(table);
                init();
            })
        })
    });
};

// Validate to have correct input
const validateTheResponse = async (input) => {
    if (input === "") {
       return 'Input reuired!!';
    }
    return true;
};

// function to add a new department to the database
function addDepartment() {

    inquirer
        .prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the department?",
            validate: validateTheResponse
        }
        ])
        .then((answer) => { 
            //create the new department
            let isDuplicate = false;
            connection.query("SELECT * FROM department", (err, results) => { 
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name === answer.name) {
                        isDuplicate = true;
                    }
                }
                if (!isDuplicate) {
                    //const query = `INSERT INTO department (name) VALUES ("${answer.name}")`;
                    const query = "INSERT INTO department (name) VALUES (?)";
                    connection.query(query, [answer.name], (err, res) => {
                        if (err) {
                            throw err;
                        }
                        console.log(query);
                        console.log(`Added ${answer.name} to department`);
                    });
                } else {
                    console.log("\n---- Departement already exits! ----");
                }
                init()
            });
        });
};

//function to add a role to the database table emp_role
function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is title of the role?",
                validate: validateTheResponse
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for this role?",
                validate: validateTheResponse
            },
            {
                name: "dept",
                type: "input",
                message: "What is the department?",
                validate: validateTheResponse
            }
        ])
        .then((answer) => { 
            console.log(answer);
            let query = "SELECT * FROM department WHERE ?";
            connection.query(query, {name: answer.dept}, (err, results) => { 
                if (err) {
                    throw err;
                }
                let dept_id = results[0].deptid;
                console.log(query);
                console.log(results);
                console.log(dept_id);
                if (dept_id !== 0) {
                    // Add the role if it belongs to some department
                    query = "INSERT INTO emp_role (title, salary, dept_id) VALUES (?, ?, ?)";
                    connection.query(query, [answer.title, answer.salary, dept_id], (err, res) => {
                        if (err) {
                            throw err;
                        }
                        console.log(query);
                        console.log(`Added ${answer.title} to role`);
                    });
                }
                init();
            });

        });
};


//function to add an employee to the database table employee
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the first name?",
                validate: validateTheResponse
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the last name?",
                validate: validateTheResponse
            },
            {
                name: "role",
                type: "input",
                message: "What is the role?",
                validate: validateTheResponse
            },
            {
                name: "dept",
                type: "input",
                message: "What is the department?",
                validate: validateTheResponse
            },
            {
                name: "manager",
                type: "input",
                message: "Full name of the manager (FirstName Lastname), this can be empty"
            }
        ])
        .then((answer) => { 
            //SELECT id FROM emp_role INNER JOIN department ON dept_id=deptid  WHERE title = "Tester" AND name = "IT";
            let query = "SELECT id FROM emp_role INNER JOIN department ON dept_id = deptid WHERE title = ? AND name = ?";
            connection.query(query, [answer.role, answer.dept], (err, results) => { 
                if (err) {
                    throw err;
                }
                let role_id = results[0].id;
                let manager =  answer.manager.trim();
                let manager_id;
                if (manager) {
                    // Need to get Manager id
                    let mgr = manager.split(" ");
                    let mgrFirstname = mgr[0];
                    let mgrLastname = mgr[1];
                    let query2 = "SELECT empid FROM employee WHERE first_name = ? AND last_name = ?";
                    //SELECT empid FROM employee WHERE first_name = "Mark" AND last_name = "Zuppa";
                    connection.query(query2, [mgrFirstname, mgrLastname], function (err, result) { 
                        if (err) {
                            throw err;
                        }
                        manager_id = result[0].empid;
                        query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        connection.query(query, [answer.firstName, answer.lastName, role_id, manager_id], function (err, reults) {
                            if (err) {
                                throw err;
                            }
                            console.log(`Added an employee ${answer.firstName} ${answer.lastName} to database`);
                            init();
                        });
                    });
                } else {
                    query = "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)";
                    connection.query(query, [answer.firstName, answer.lastName, role_id], function (err, reults) {
                        if (err) {
                            throw err;
                        }
                        console.log(`Added an employee ${answer.firstName} ${answer.lastName} to database`);
                        init();
                    });
                }
            });
        });
};