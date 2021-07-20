DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
-- includes foreign key for joining with other tables
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT fk_dept FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);
-- includes foreign key for joining with other tables and for assigning managers
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE SET NULL,
    manager_id INT NULL,
    CONSTRAINT fk_manager FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);


