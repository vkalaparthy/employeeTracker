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
        switch(response.choice) {
            case "View All employees":
                viewAllEmployees();
                break;
            case "View all employees by Department":
                viewEmpByDept();
                break;
            case "View all Departments":
                viewAllDepartments();
                break;
            case "Add new employee":
                addNewEmployee();
                break;
            default:
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
    connection.query("SELECT * FROM department", (err, results) => {
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
                  choiceArray.push(results[i].name);
                }
                return choiceArray;
              },
              message: "Choose a department"
            }
        ])
        .then((answer) => { 
            let query = "SELECT first_name, last_name, name from employee ";
            query += "INNER JOIN emp_role ON employee.role_id = emp_role.id ";
            query += "INNER JOIN department ON emp_role.dept_id = department.deptid ";
            query += "WHERE ?";
            connection.query(query, {name: answer.choice}, (err, res) => {
                //console.log(query);
                console.log("\n--------------------------------------------------");
                const table = cTable.getTable(res);
                console.log(table);
                init();
            })
        })
        //init()
    });
};