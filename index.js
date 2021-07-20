const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// info for database connection
const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,
  
    user: 'root',
  
    password: 'password123',
    database: 'employee_trackerDB',
});

// connect and run init
connection.connect((err) => {
    if (err) throw err;
    init();
});

// basic menu questions
let menu = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: ['View All Employees',  
                'Add Employee', 
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View Departments',
                'Add Department']
    }
];

// run inquirer and run result through switch function
const init = () => {
    inquirer.prompt(menu)
        .then((data) => {
            renderMenuChoice(data.menu);
        });
};

// controls which function is run according to choice
const renderMenuChoice = (menu) => {
    switch (menu) {
        case 'View All Employees':
            renderEmployeeList();
            break;

        case 'Add Employee':
            employeeManager();
            break;
        
        case 'Update Employee Role':
            chooseEmployee();
            break;

        case 'View All Roles':
            viewRoles();
            break;

        case 'Add Role':
            addRole();
            break;

        case 'View Departments':
            viewDepartments();
            break;

        case 'Add Department':
            addDepartment();
            break;
    }
};

// render employee table w/info according to relevant data from other tables according to foreign keys
let renderEmployeeList = () => {
    console.log('Collecting Employee Data...');
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name AS department, roles.salary FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id', (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

// render role table
let viewRoles = () => {
    console.log('Collecting Role Data...');
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

// render department table
let viewDepartments = () => {
    console.log('Collecting Department Data...');
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

// render list of managers for 'add employee' option
const employeeManager = () =>{
    console.log('Preparing Manager List...')
    connection.query('SELECT * FROM employee WHERE manager_id IS null', (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices() {
                        const managerArray = [];
                        results.forEach(({ first_name, id, last_name }) => {
                            managerArray.push({
                                name: `${first_name} ${last_name}`,
                                value: id
                            });
                        })
                        return managerArray;
                    },
                    message: 'Please choose a manager:',
                }
            ])
            .then((data) => {
                addEmployee(data);
            });
    });
};

// render roles list for 'add employee' with manager info parameter, then add employee to employee table
const addEmployee = (manager) => {
    console.log('Preparing to Add New Employee...');
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: "Please input employee's first name:",
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: "Please input employee's last name:",
                },
                {
                    name: 'role',
                    type: 'rawlist',
                    choices() {
                        const roleArray = [];
                        results.forEach(({ title }) => {
                            roleArray.push(title);
                        })
                        return roleArray;
                    },
                    message: 'Please choose a role:',
                }
            ])
            .then((data) => {
                let chosenRole;
                results.forEach((role) => {
                    if (role.title == data.role) {
                        chosenRole = role;
                    }
                });
                connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role_id: chosenRole.id,
                        manager_id: manager.manager,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('Your employee has been added successfully.')
                        init();
                    }
                );

            });
    });
};

// render employee list for 'update employee role' option
let chooseEmployee = () => {
    console.log('Collecting Possible Employees...');
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employeeName',
                    type: 'list',
                    choices() {
                        const employeeArray = [];
                        // shows employee first and last names to user and assigns id value
                        results.forEach(({ first_name, id, last_name }) => {
                            employeeArray.push({
                                name: `${first_name} ${last_name}`,
                                value: id
                            });
                        });
                        return employeeArray;
                },
                    message: 'Please choose an employee:',
                }
            ])
            .then((data) => {
                updateEmployeeRole(data);
            });
    });
};

// render role list for 'update employee role' option with employee info parameter. changes employee role according to user choices
let updateEmployeeRole = (employee) => {
    console.log('Collecting Roles...');
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'roles',
                    type: 'rawlist',
                    choices() {
                        const roleArray = [];
                        results.forEach(({ title }) => {
                            roleArray.push(title);
                        })
                        return roleArray;
                    },
                    message: 'Please choose a new role:',
                }
            ])
            .then((data) => {
                let chosenRole;
                results.forEach((role) => {
                    if (role.title == data.roles) {
                        chosenRole = role;
                    }
                });
                connection.query(
                    'UPDATE employee SET ? WHERE ?',
                    [
                    {
                        role_id: chosenRole.id,
                    },
                    {
                        id: employee.employeeName,
                    },
                    ],
                    (err) => {
                        if (err) throw err;
                        console.log('Your employee role has been updated successfully.');
                        init();
                    }
                );

            });
    });
};

// adds new role within department choices
let addRole = () => {
    console.log('Preparing to Add New Role...');
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'roleTitle',
                    type: 'input',
                    message: 'Please name the role you would like to add:',
                },
                {
                    name: 'roleSalary',
                    type: 'input',
                    message: 'Please give a salary for this role:',
                },
                {
                    name: 'deptId',
                    type: 'rawList',
                    type: 'rawlist',
                    choices() {
                        const deptArray = [];
                        results.forEach(({ dept_name }) => {
                            deptArray.push(dept_name);
                        })
                        return deptArray;
                    },
                    message: 'Please choose a department:',
                },
            ])
            .then((data) => {
                let chosenDept;
                results.forEach((dept) => {
                    if (dept.dept_name == data.deptId) {
                        chosenDept = dept;
                    }
                });
                connection.query(
                    'INSERT INTO roles SET ?',
                    {
                        title: data.roleTitle,
                        salary: data.roleSalary,
                        department_id: chosenDept.id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('Your role has been added successfully.')
                        init();
                    }
                );

            });
    });
};

// adds new department
let addDepartment = () => {
    console.log('Preparing to Add New Department...');
    inquirer
        .prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'Please name the department you would like to add:',
            }
        ])
        .then((data) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    dept_name: data.deptName
                },
                (err) => {
                    if (err) throw err;
                    console.log('Your department has been added successfully.');
                    init();
                }
            );
        });
};