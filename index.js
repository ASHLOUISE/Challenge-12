const { prompt } = require('inquirer');
const db = require('./db');


function mainPrompt() {
    prompt([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        
        }
    ]).then((response) => {
        let choices = response.choices;
        
        if(choices === "VIEW_EMPLOYEES") {
            viewEmployees();

        } else if(choices === "VIEW_EMPLOYEES_BY_DEPARTMENT") {
            viewEmployeesByDepartment();

        } else if(choices === "VIEW_DEPARTMENTS") {
            viewDepartments();

        } else if(choices === "VIEW_EMPLOYEES_BY_MANAGER") {
            viewEmployeesByManager();

        } else if(choices === "ADD_EMPLOYEE") {
            addEmployee();

        } else if(choices === "REMOVE_EMPLOYEE") {
            removeEmployee();

        } else if(choices === "UPDATE_EMPLOYEE_ROLE") {
            updateEmployeeRole();
        }
        else if(choices === "UPDATE_EMPLOYEE_MANAGER") {
            updateEmployeeManager();

        } else if(choices === "VIEW_ROLES") {
            viewRoles();

        } else if(choices === "ADD_ROLE") {
            addRole();

        } else if(choices === "ADD_DEPARTMENT") {
            addDepartment();

        } else if(choices === "REMOVE_DEPARTMENT") {
            removeDepartment();
        }
        else {
            quit();
        }
    })
}

function init() {
    mainPrompt();
}

async function viewEmployees() {
    const [rows] = await db.findAllEmployees()
    console.table(rows);
    mainPrompt();
}


async function viewEmployeesByDepartment() {
    const [departments] = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see employees for?",
            choices: departmentChoices}]).then(async (response) => {
                const [rows] = await db.findAllEmployeesByDepartment(response.departmentId);
                console.table(rows);
            }).then(() => mainPrompt());
}

async function viewDepartments() {
    const [rows] = await db.findAllDepartments();
    console.table(rows);
    mainPrompt();
}

async function viewEmployeesByManager() {
    const [employees] = await db.findAllPossibleManagers();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee's manager would you like to see?",
            choices: employeeChoices}]).then(async (response) => {
                const [rows] = await db.findAllEmployeesByManager(response.managerId);
                console.table(rows);
            }).then(() => mainPrompt());
}

async function addEmployee() {
    const [roles] = await db.findAllRoles();
    const [employees] = await db.findAllEmployees();
    const employee = await prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
    });
    employee.role_id = roleId;
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    managerChoices.unshift({ name: "None", value: null });
    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices
    });
    employee.manager_id = managerId;
    await db.createEmployee(employee);
    console.log(`${employee.first_name} ${employee.last_name} has been added to the database`);
    mainPrompt();
}

async function removeEmployee() {
    const [employees] = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { employeeId } = await prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to remove?",
        choices: employeeChoices
    });
    await db.removeEmployee(employeeId);
    console.log("Employee has been removed from the database");
    mainPrompt();
}

async function updateEmployeeRole() {
    const [employees] = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { employeeId } = await prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee's role would you like to update?",
        choices: employeeChoices
    });
    const [roles] = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's new role?",
        choices: roleChoices
    });
    await db.updateEmployeeRole(employeeId, roleId);
    console.log("Employee's role has been updated");
    mainPrompt();
}

async function updateEmployeeManager() {
    const [employees] = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { employeeId } = await prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee's manager would you like to update?",
        choices: employeeChoices
    });
    const [managers] = await db.findAllPossibleManagers(employeeId);
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the employee's new manager?",
        choices: managerChoices
    });
    await db.updateEmployeeManager(employeeId, managerId);
    console.log("Employee's manager has been updated");
    mainPrompt();
}

async function viewRoles() {
    const [rows] = await db.findAllRoles();
    console.table(rows);
    mainPrompt();
}

async function addRole() {
    const [departments] = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    const role = await prompt([
        {
            name: "title",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
        }
    ]);
    await db.createRole(role);
    console.log(`${role.title} has been added to the database`);
    mainPrompt();
}

async function addDepartment() {
    const department = await prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);
    await db.createDepartment(department);
    console.log(`${department.name} has been added to the database`);
    mainPrompt();
}

async function removeDepartment() {
    const [departments] = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    const { departmentId } = await prompt({
        type: "list",
        name: "departmentId",
        message: "Which department would you like to remove?",
        choices: departmentChoices
    });
    await db.removeDepartment(departmentId);
    console.log("Department has been removed from the database");
    mainPrompt();
}


function quit() {
    console.log("Goodbye!");
    process.exit();
}    



init();
