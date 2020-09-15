const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const showBanner = require("node-banner");

// Open a connection
const connection = mysql.createConnection({
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
      choices: ["View", "Add", "View employees by Manager",  
       "Update employee role", "Delete a employee", 
       "Utilized budget of a department", "Exit"]
    })
    .then (function(response) {
        switch(response.choice) {
            case "View":
                viewWhat();
                break;
            case "Add":
                addWhat();
                break;
            case "View employees by Manager":
                viewEmpByMgr();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Delete a employee":
                deleteEmployee();
                break;
            case "Utilized budget of a department":
                budgetPerDept();
                break;
            default:
                connection.end();
        }
    })
};

//Function to view Departms, Roles and Employees based on user choice
function viewWhat() {
    inquirer
    .prompt([
        {
            name: "choice",
            type: "list",
            message: "Choose what to view",
            choices: ["All Departments", "All Roles", "All Employees"]
        }
    ])
    .then (viewOption => {
        let query = "";
        if (viewOption.choice === "All Departments") {
            query = "SELECT * FROM department";
        } else if (viewOption.choice === "All Roles") {
            query = "SELECT title, salary, name as department FROM emp_role INNER JOIN department ON dept_id = deptid";
        } else {
            query = "SELECT CONCAT(a.first_name, \" \", a.last_name) AS fullname, title, salary, name AS department, ";
            query += "CONCAT(b.first_name, \" \", b.last_name) AS manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.empid ";
            query += "INNER JOIN emp_role ON a.role_id = id INNER JOIN department ON dept_id = deptid";
        }
        connection.query(query, function(err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log("\n--------------------------------------------------");
            const table = cTable.getTable(res);
            console.log(table);
            // Go back to prompt user 
            init();
        });
    })
}

//function to add a new Department or a Role or an Employee to the company based on user's choice
function addWhat() {
    inquirer
    .prompt([
        {
            name: "choice",
            type: "list",
            message: "Choose what to add",
            choices: ["A new department", "A new role", "A new employees"]
        }
    ])
    .then (answer => {
        if (answer.choice === "A new department") {
            addDepartment();
        } else if (answer.choice === "A new role") {
            addRole();
        } else {
            addEmployee();
        }
    })
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
                for (let i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].first_name + " " + results[i].last_name);
                }
                return choiceArray;
              },
              message: "Choose a Manager"
            }
        ])
        .then((answer) => { 

            let manager_id;
            for (let i = 0; i < results.length; i++) {
                if (answer.choice === results[i].first_name + " " + results[i].last_name) {
                    manager_id = results[i].empid;
                }
            }
            query = "SELECT  CONCAT(first_name, \" \", last_name) AS fullname, title FROM employee ";
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

// Validate to have correct input for prompt
const validateTheResponse = async (input) => {
    if (input === "") {
       return 'Input reuired!!';
    } else if (! /^[a-zA-Z ]*$/.test(input)) {
        return "Incoorect input!";
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
                for (let i = 0; i < results.length; i++) {
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
    let query = "SELECT * FROM department";
    connection.query(query, (err, results) => { 
        if (err) {
            throw err;
        }
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
            },
            {
                name: "dept",
                type: "rawlist",
                choices: function() {
                  const choiceArray = [];
                  for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].name);
                  }
                  return choiceArray;
                },
                message: "Choose a department"
            }
        ])
        .then((answer) => { 
            let dept_id;
            //Get the dept_id from the previous query results
            for (let i = 0; i < results.length; i++) {
                if (results[i].name === answer.dept)
                    dept_id = results[i].deptid;
            }
            //console.log(dept_id);
            query = "INSERT INTO emp_role (title, salary, dept_id) VALUES (?, ?, ?)";
            connection.query(query, [answer.title, answer.salary, dept_id], (err, res) => {
                if (err) {
                    throw err;
                }
                //console.log(`Added ${answer.title} to role`);
                init();
            });

        });

    });
};

// function might be removed soon
function getRoleQuestion() {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM emp_role", (err, roleResults) => { 
        if (err) {
            return reject(err);
        } 
        const choiceArray = [];
        for (let i = 0; i < roleResults.length; i++) {
            choiceArray.push(roleResults[i].title);
        }
        const question = [
            {
                name: "role",
                type: "rawlist",
                message: "Try new prompt for role",
                choices: choiceArray
            }
        ];
        console.log(question);
        resolve(question);
    });
  })
};

//This function might be removed
function promptForRole () {
    connection.query("SELECT * FROM emp_role", (err, roleResults) => { 
        if (err) {
            throw err;
        }
        inquirer
        .prompt([ 
            {
                name: "role",
                type: "rawlist",
                choices: function() {
                    const choiceArray = [];
                    for (let i = 0; i < roleResults.length; i++) {
                        choiceArray.push(roleResults[i].title);
                    }
                    //return choiceArray;
                    return ([...new Set(choiceArray)]);
                },
                message: "Choose a role"
            }
        ])
        .then (answer => {
            console.log(answer);
            return answer.role;
        })
    })
};

//This function is not used, trying to see ow I can move some common promts
function promptForDept () {
    connection.query("SELECT * FROM department", (err, deptResults) => { 
        if (err) {
            throw err;
        }
        const deptAnswer = inquirer.prompt([ 
            {
                name: "dept",
                type: "rawlist",
                choices: function() {
                    const choiceArray = [];
                    for (let i = 0; i < deptResults.length; i++) {
                        choiceArray.push(deptResults[i].name);
                    }
                    return choiceArray;
                },
                message: "Choose a department"
            }
        ])
        .then( answer => {
            console.log(answer);
            return answer.dept;
        })
    })
};

//function to add an employee to the database table employee. This function is too long, should see how to break it to smaller chunks!
async function addEmployee() {
    let role_id;
    let manager_id;
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
            }
        ])
        .then (answer => {
            connection.query("SELECT * FROM emp_role", (err, roleResults) => { 
                if (err) {
                    throw err;
                }
                inquirer
                .prompt([ 
                    {
                        name: "role",
                        type: "rawlist",
                        choices: function() {
                            const choiceArray = [];
                            for (let i = 0; i < roleResults.length; i++) {
                                choiceArray.push(roleResults[i].title);
                            }
                            //return choiceArray;
                            return ([...new Set(choiceArray)]);
                        },
                        message: "Choose a role"
                    }
                ])
            // try {
            //     const question = await getRoleQuestion();
            //     console.log(question);
            // } 
            // catch (error) {
            //     console.log(error)
            // }
            // init();
            //const role = await promptForRole();
        //    const dept = promptForDept();
                .then(roleAnswer => {
                    connection.query("SELECT * FROM department", (err, deptResults) => { 
                        if (err) {
                            throw err;
                        }
                        inquirer
                        .prompt([ 
                            {
                                name: "dept",
                                type: "rawlist",
                                choices: function() {
                                    const choiceArray = [];
                                    for (let i = 0; i < deptResults.length; i++) {
                                        choiceArray.push(deptResults[i].name);
                                    }
                                    return choiceArray;
                                },
                                message: "Choose a department"
                            }
                        ])
                        .then (deptAnswer => {
                            let query2 = "SELECT id FROM emp_role INNER JOIN department ON dept_id = deptid WHERE title = ? AND name = ?";
                            connection.query(query2, [roleAnswer.role, deptAnswer.dept], (err, response) => {
                                if (err) {
                                    throw err;
                                }
                                role_id = response[0].id;
                                connection.query("SELECT empid, first_name, last_name from employee", (err, empResult) => {
                                    if (err) {
                                        throw err;
                                    }
                                    inquirer
                                    .prompt([ 
                                        {
                                            name: "manager",
                                            type: "rawlist",
                                            choices: function() {
                                                const choiceArray = ["none"];
                                                for (let i = 0; i < empResult.length; i++) {
                                                    choiceArray.push(empResult[i].first_name + " " + empResult[i].last_name);
                                                }
                                                return choiceArray;
                                            },
                                            message: "Choose a Manager"
                                        }
                                    ])
                                    .then ( (mgrAnswer) => {
                                        if (mgrAnswer.manager === "none") {
                                            query = "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)";
                                            connection.query(query, [answer.firstName, answer.lastName, role_id], function (err, reults) {
                                                if (err) {
                                                    throw err;
                                                }
                                                //console.log(`Added an employee ${answer.firstName} ${answer.lastName} to database`);
                                                init();
                                            });
                                        }
                                        else {
                                            let mgr = mgrAnswer.manager.split(" ");
                                            let mgrFirstname = mgr[0];
                                            let mgrLastname = mgr[1];
                                            for (let i = 0; i < empResult.length; i++) {
                                                if (empResult[i].first_name === mgrFirstname  && empResult[i].last_name === mgrLastname) {
                                                    manager_id = empResult[i].empid;
                                                }
                                            }
                                            query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                                            connection.query(query, [answer.firstName, answer.lastName, role_id, manager_id], function (err, reults) {
                                                if (err) {
                                                    throw err;
                                                }
                                                console.log(`Added an employee ${answer.firstName} ${answer.lastName} to database`);
                                                init();
                                            });
                                        }
                                    })
                                })

                            })


                        })
                    });
                })
            });
        })
};


// Function to update employee role
function updateEmployeeRole() {

    connection.query("SELECT * FROM employee", (err, results) => { 
        if (err) {
            throw err;
        }
        inquirer
        .prompt([
          {
            name: "empName",
            type: "rawlist",
            choices: function() {
                const choiceArray = [];
                for (let i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].first_name + " " + results[i].last_name);
                }
                return choiceArray;
            },
            message: "Choose a employee"
          }
        ])
        .then (answer => { 
            let firstName = answer.empName.split(" ")[0];
            let lastName = answer.empName.split(" ")[1];
            connection.query("SELECT id, title, name FROM emp_role INNER JOIN department ON dept_id = deptid", (err, roleResults) => { 
                if (err) {
                    throw err;
                }
                inquirer
                .prompt([ 
                    {
                        name: "role",
                        type: "rawlist",
                        choices: function() {
                            const choiceArray = [];
                            for (let i = 0; i < roleResults.length; i++) {
                                choiceArray.push(roleResults[i].title + " " + roleResults[i].name);
                            }
                            //return choiceArray;
                            return ([...new Set(choiceArray)]);
                        },
                        message: "Choose a role"
                    }
                ])
                .then (roleAnswer => {
                    let role = roleAnswer.role;
                    let title = role.split(" ")[0];
                    let name = role.split(" ")[1];
                    for (let i = 0; i < roleResults.length; i++) {
                        if (roleResults[i].title === title && roleResults[i].name === name) {
                            role_id = roleResults[i].id;
                        }
                    }
                    
                    query = "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?";
                    connection.query(query, [role_id, firstName, lastName], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        init();
                        
                    })
                })
            })

        })
    })

};

// function to delete an employee from the database
function deleteEmployee() {

    connection.query("SELECT * FROM employee", (err, results) => { 
        if (err) {
            throw err;
        }
        inquirer
        .prompt([
          {
            name: "empName",
            type: "rawlist",
            choices: function() {
                const choiceArray = [];
                for (let i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name + " " + results[i].last_name);
                }
                return choiceArray;
            },
            message: "Choose a employee to be deleted"
          }
        ])
        .then (answer => {
            let first_name = answer.empName.split(" ")[0];
            let last_name = answer.empName.split(" ")[1];
            let empid = 0;
            for (let i = 0; i < results.length; i++) {
                if (first_name === results[i].first_name  && last_name === results[i].last_name) {
                    empid = results[i].empid;
                }
            }
            connection.query("DELETE FROM employee WHERE empid = ?", [empid], (err, results) => {
                if (err) {
                    throw err;
                }
                //console.log("Delete successful");
                init();
            })
        })
    });
};

//function to view budget of a department
function budgetPerDept() {
    connection.query("SELECT * FROM department", (err, deptResults) => { 
        if (err) {
            throw err;
        }
        inquirer
        .prompt([ 
            {
                name: "dept",
                type: "rawlist",
                choices: function() {
                    const choiceArray = [];
                    for (let i = 0; i < deptResults.length; i++) {
                        choiceArray.push(deptResults[i].name);
                    }
                    return choiceArray;
                },
                message: "Choose a department"
            }
        ])
        .then (answer => {
            let deptid = 0
            let total = 0;
            for (let i = 0; i < deptResults.length; i++) {
                if(deptResults[i].name === answer.dept) {
                    deptid = deptResults[i].deptid;
                }
            }
            console.log("\n--------------------------------------------");
            let query = "SELECT salary FROM emp_role WHERE dept_id = ?";
            connection.query (query, [deptid], (err, results) => {
                for (let i = 0; i < results.length; i++) {
                    total += results[i].salary;
                }
                console.log(`${total.toFixed(2)} was utilized by ${answer.dept}. `);
                console.log("--------------------------------------------");
                init()
            })
        })
    });

}