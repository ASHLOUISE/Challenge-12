use employees;

INSERT INTO department (name) VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id) VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Data Engineer', 150000, 2),
    ('Software Engineer (SWE)', 120000, 2),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Malia', 'Brown', 5, 3),
    ('Sarah', 'Lourd', 6, NULL),
    ('Tom', 'Allen', 7, 6),
    ('Tina', 'Lee', 7, 6),
    ('Mark', 'Lee', 7, 6),
    ('Sally', 'Smith', 7, 6);

