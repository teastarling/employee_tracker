INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mickey", "Mouse", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Donald", "Duck", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Minnie", "Mouse", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Goofy", "Goof", 4, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Head Mouse", 200000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Dollar Duck", 100000, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Web Mouse", 150000, 3);

INSERT INTO roles (title, salary, department_id)
VALUES ("Worry Dog", 90000, 4);

INSERT INTO department (dept_name)
VALUES ("Marketing");

INSERT INTO department (dept_name)
VALUES ("Finance");

INSERT INTO department (dept_name)
VALUES ("Technology");

INSERT INTO department (dept_name)
VALUES ("Risk Management");