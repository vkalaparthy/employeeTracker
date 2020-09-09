const inquirer = require("inquirer");
const mysql = require("mysql");

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

connection.connect(err => {
    if (err) {
        throw err;
    }
    console.log(`connected as id ${connection.threadId}`);
    init();
});

function init() {
    console.log("In init");
    displayDepartment();
    // displayEmployee();
    // displayEmpRole();
    connection.end();
};

function displayDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.log("-----------------------------");
      });
};

function displayEmployee() {
    connection.query("SELECT * FROM emp_role", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.log("-----------------------------");
      });
};

function displayEmpRole() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.log("-----------------------------");
      });
};