const connection = require('./connection');

function DB() {
    this.connection = connection;
}

DB.prototype.createTables = async function () {
    await this.connection.promise().query("DROP DATABASE IF EXISTS employees");
    await this.connection.promise().query("CREATE DATABASE employees");
    await this.connection.promise().query("USE employees");


    await this.connection.promise().query(`
        CREATE TABLE department (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(30) UNIQUE NOT NULL
        )
    `);

    await this.connection.promise().query(`
        CREATE TABLE role (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30) UNIQUE NOT NULL,
            salary DECIMAL NOT NULL,
            department_id INT NOT NULL,
            INDEX dep_ind (department_id),
            CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
        )
    `);

    await this.connection.promise().query(`
        CREATE TABLE employee (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INT NOT NULL,
            INDEX role_ind (role_id),
            CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
            is_manager BOOLEAN DEFAULT FALSE,
            manager_id INT,
            INDEX manager_ind (manager_id),
            CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
        )
    `);


    console.log('Tables created');
}


DB.prototype.findAllEmployees = async function () {
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

DB.prototype.findAllEmployeesByDepartment = async function (departmentId) {
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

DB.prototype.findAllDepartments = async function () {
    const data = await this.connection.promise().query(`SELECT * FROM department;`);
    return data;
}

DB.prototype.findAllPossibleManagers = async function (employeeId) {
    let query = `
        SELECT id, first_name, last_name 
        FROM employee`;

    if (employeeId) {
        query += ` WHERE id != ?`;
    }

    const data = await this.connection.promise().query(query, [employeeId]);
    return data;
}

DB.prototype.findAllEmployeesByManager = async function (managerId) {
    const data = await this.connection.promise().query(`
        SELECT id, first_name, last_name 
        FROM employee
        WHERE manager_id = ?;
    `, managerId);
    return data;
}



DB.prototype.createEmployee = async function (employee) {
    const data = await this.connection.promise().query("INSERT INTO employee SET ?", employee)
    return data;
}

DB.prototype.removeEmployee = async function (employeeId) {
    const data = await this.connection.promise().query("DELETE FROM employee WHERE id = ?", employeeId);
    return data;
}

DB.prototype.updateEmployeeRole = async function (employeeId, roleId) {
    const data = await this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
    return data;
}

DB.prototype.updateEmployeeManager = async function (employeeId, managerId) {
    const data = await this.connection.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]);
    return data;
}

DB.prototype.findAllRoles = async function () {
    const data = await this.connection.promise().query(`SELECT 
    role.id, 
    role.title, 
    department.name AS department, 
    role.salary
    FROM role
    JOIN department ON role.department_id = department.id;`);
    return data;
}

DB.prototype.createRole = async function (role) {
    const data = await this.connection.promise().query("INSERT INTO role SET ?", role);
    return data;
}

DB.prototype.removeRole = async function (roleId) {
    const data = await this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
    return data;
}

DB.prototype.createNewDepartment = async function (department) {
    const data = await this.connection.promise().query("INSERT INTO department SET ?", department);
    return data;
}

DB.prototype.removeDepartment = async function (departmentId) {
    const data = await this.connection.promise().query("DELETE FROM department WHERE id = ?", departmentId);
    return data;
}


module.exports = new DB();