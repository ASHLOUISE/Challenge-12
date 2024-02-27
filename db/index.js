const connection = require('./connection');

function DB() {
    this.connection = connection;
}

DB.prototype.findAllEmployees = async function() {
    const data = await this.connection.promise().query(`SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id;`);
    return data;
}

DB.prototype.findAllEmployeesByDepartment = async function(departmentId) {
    const data = await this.connection.promise().query(`SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title
    FROM employee
    JOIN role ON employee.role_id = role.id
    WHERE role.department_id = ?;`, departmentId);
    return data;
}

DB.prototype.findAllDepartments = async function() {
    const data = await this.connection.promise().query(`SELECT * FROM department;`);
    return data;
}

DB.prototype.findAllPossibleManagers = async function(employeeId) {
    const data = await this.connection.promise().query(`SELECT 
    id, 
    first_name, 
    last_name 
    FROM employee
    WHERE id != ?;`, employeeId);
    return data;
}

DB.prototype.createEmployee = async function(employee) {
    const data = await this.connection.promise().query("INSERT INTO employee SET ?", employee)
    return data;
}

DB.prototype.removeEmployee = async function(employeeId) {
    const data = await this.connection.promise().query("DELETE FROM employee WHERE id = ?", employeeId);
    return data;
}

DB.prototype.updateEmployeeRole = async function(employeeId, roleId) {
    const data = await this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
    return data;
}

DB.prototype.updateEmployeeManager = async function(employeeId, managerId) {
    const data = await this.connection.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]);
    return data;
}

DB.prototype.findAllRoles = async function() {
    const data = await this.connection.promise().query(`SELECT 
    role.id, 
    role.title, 
    department.name AS department, 
    role.salary
    FROM role
    JOIN department ON role.department_id = department.id;`);
    return data;
}

DB.prototype.createRole = async function(role) {
    const data = await this.connection.promise().query("INSERT INTO role SET ?", role);
    return data;
}

DB.prototype.createNewDepartment = async function(department) {
    const data = await this.connection.promise().query("INSERT INTO department SET ?", department);
    return data;
}

DB.prototype.removeDepartment = async function(departmentId) {
    const data = await this.connection.promise().query("DELETE FROM department WHERE id = ?", departmentId);
    return data;
}


module.exports = new DB();