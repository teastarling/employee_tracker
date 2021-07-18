const inquirer = require('inquirer');


let menu = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: ['View All Employees', 
                'View All Employees by Department', 
                'Add Employee', 
                'Remove Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'Remove Role']
    }
];
const init = () => {
    inquirer.prompt(menu)
        .then((data) => {
            renderMenuChoice(data)
        });
};

const renderMenuChoice = (menu) => {
    switch (menu) {
        case 'View All Employees':
            return renderEmployeeList();
        
        case 'View All Employees by Department':
            return renderEmployeeDepartmentList();

        case 'Add Employee':
            return addEmployee();

        case 'Remove Employee':
            return removeEmployee();
        
        case 'Update Employee Role':
            return updateEmployeeRole();

        case 'View All Roles':
            return viewRoles();

        case 'Add Role':
            return addRole();

        case 'Remove Role':
            return removeRole();
    }
}

init();