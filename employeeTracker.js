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

function init() {
    console.log("\n");
    inquirer.prompt ({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: ["View All employees", "View all employees by Department", 
      "View all Departments", "Exit"]
    })
    .then (function(response) {
        if (response.choice === "View All employees") {
            viewAllEmployees();
        }
        else if (response.choice === "View all employees by Department") {
            viewEmpByDept();
        }
        else if (response.choice === "View all Departments") {
            viewAllDepartments();
        }
        else {
            connection.end();
        }
    })
};

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

function viewAllEmployees() {
   // connection.query("SELECT * FROM employee", function(err, res) {
    connection.query(
    "SELECT empid, first_name, Last_name, c1.title, c1.salary, c2.name FROM employee AS c INNER JOIN emp_role AS c1 ON c.role_id = c1.id INNER JOIN department AS c2 ON c1.dept_id = c2.deptid", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\n--------------------------------------------------");
        const table = cTable.getTable(res);
        console.log(table);
        // Go back to prompt user 
        init();
    });
};

function viewEmpByDept() {
    console.log("viewEmpByDept");
    // Go back to prompt user
    init()
};