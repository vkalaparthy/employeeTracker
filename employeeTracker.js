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
      "View all Departments", "View all roles", "Add a new Department", "Exit"]
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
            case "View all roles":
                viewAllRoles();
                break;
            case "Add a new Department":
                addDepartment();
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

function viewAllEmployees() {
   let query = "SELECT empid, first_name, Last_name, title, salary, name FROM employee ";
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

function viewEmpByDept() {
    //console.log("viewEmpByDept");
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
            let query = "SELECT first_name, last_name, title from employee ";
            query += "INNER JOIN emp_role ON employee.role_id = emp_role.id ";
            query += "INNER JOIN department ON emp_role.dept_id = department.deptid ";
            query += "WHERE ?";
            connection.query(query, {name: answer.choice}, (err, res) => {
                if (err) throw err;
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

const validateTheResponse = async (input) => {
    if (input === "") {
       return 'Incorrect response!!';
    }
    return true;
}

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
            const query = `INSERT INTO department (name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) {
                    throw err;
                }
                console.log(`Added ${answer.name} to department`);
                init();
            })
        })
};