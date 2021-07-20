const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,
  
    user: 'root',
  
    password: 'password123',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    init();
});

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
                'Add Departments']
    }
];

const init = () => {
    inquirer.prompt(menu)
        .then((data) => {
            renderMenuChoice(data.menu);
        });
};

const renderMenuChoice = (menu) => {
    switch (menu) {
        case 'View All Employees':
            renderEmployeeList();
            break;

        case 'Add Employee':
            addEmployee();
            break;
        
        case 'Update Employee Role':
            updateEmployeeRole();
            break;

        case 'View All Roles':
            viewRoles();
            break;

        case 'Add Role':
            addRole();
            break;

        case 'View All Departments':
            viewDepartments();
            break;

        case 'Add Departments':
            addDepartments();
            break;
    }
}

let renderEmployeeList = () => {
    console.log('Collecting Employee Data...');
    connection.query('SELECT first_name, last_name FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

let viewRoles = () => {
    console.log('Collecting Role Data...');
    connection.query('SELECT title, salary FROM roles', (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

let viewDepartments = () => {
    console.log('Collecting Department Data...');
    connection.query('SELECT dept_name FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
};

let addEmployee = () => {
    console.log('Preparing to Add New Employee...');
    connection.query('SELECT title FROM roles', (err, results) => {
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
        })
}
