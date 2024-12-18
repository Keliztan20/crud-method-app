
CREATE DATABASE UserData;

USE UserData;

-- Create User Roles table
CREATE TABLE user_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id_FK INT,
    FOREIGN KEY (role_id_FK) REFERENCES user_roles(role_id)
);

-- Insert 50 unique role names into the user_roles table
INSERT INTO user_roles (role_name) VALUES
    ('Super Admin'),
    ('Admin'),
    ('Manager'),
    ('User'),
    ('Intern'),
    ('HR Specialist'),
    ('Project Manager'),
    ('Developer'),
    ('Designer'),
    ('Team Leader'),
    ('Data Analyst'),
    ('Support Specialist'),
    ('Marketing Manager'),
    ('Accountant'),
    ('Finance Manager'),
    ('Sales Executive'),
    ('Customer Service Representative'),
    ('Product Owner'),
    ('Business Analyst'),
    ('Network Engineer'),
    ('System Administrator'),
    ('Web Developer'),
    ('Mobile Developer'),
    ('SEO Specialist'),
    ('Social Media Manager'),
    ('Content Writer'),
    ('Graphic Designer'),
    ('UI/UX Designer'),
    ('Quality Assurance Specialist'),
    ('Database Administrator'),
    ('IT Technician'),
    ('Operations Manager'),
    ('Public Relations Officer'),
    ('Technical Lead'),
    ('Software Architect'),
    ('Test Engineer'),
    ('Technical Writer'),
    ('Chief Technology Officer'),
    ('Chief Operating Officer'),
    ('Chief Executive Officer'),
    ('Sales Manager'),
    ('Customer Success Manager'),
    ('Legal Advisor'),
    ('Executive Assistant'),
    ('Project Coordinator'),
    ('Supply Chain Manager'),
    ('Product Manager'),
    ('Research Analyst'),
    ('Business Development Manager'),
    ('Risk Analyst');

-- Insert 50 sample users with random role_id_FK assignments
INSERT INTO users (first_name, last_name, role_id_FK) VALUES
    ('John', 'Doe', FLOOR(1 + (RAND() * 50))),
    ('Jane', 'Smith', FLOOR(1 + (RAND() * 50))),
    ('Alice', 'Johnson', FLOOR(1 + (RAND() * 50))),
    ('Bob', 'Brown', FLOOR(1 + (RAND() * 50))),
    ('Keli', 'KK', FLOOR(1 + (RAND() * 50))),
    ('Michael', 'Green', FLOOR(1 + (RAND() * 50))),
    ('Emily', 'Taylor', FLOOR(1 + (RAND() * 50))),
    ('David', 'Wilson', FLOOR(1 + (RAND() * 50))),
    ('Sarah', 'Moore', FLOOR(1 + (RAND() * 50))),
    ('James', 'White', FLOOR(1 + (RAND() * 50))),
    ('Laura', 'Harris', FLOOR(1 + (RAND() * 50))),
    ('Matthew', 'Clark', FLOOR(1 + (RAND() * 50))),
    ('Samantha', 'Lewis', FLOOR(1 + (RAND() * 50))),
    ('Daniel', 'Young', FLOOR(1 + (RAND() * 50))),
    ('Olivia', 'King', FLOOR(1 + (RAND() * 50))),
    ('Jack', 'Scott', FLOOR(1 + (RAND() * 50))),
    ('Megan', 'Adams', FLOOR(1 + (RAND() * 50))),
    ('Christopher', 'Baker', FLOOR(1 + (RAND() * 50))),
    ('Sophia', 'Nelson', FLOOR(1 + (RAND() * 50))),
    ('Andrew', 'Carter', FLOOR(1 + (RAND() * 50))),
    ('Hannah', 'Mitchell', FLOOR(1 + (RAND() * 50))),
    ('Lucas', 'Perez', FLOOR(1 + (RAND() * 50))),
    ('Ava', 'Roberts', FLOOR(1 + (RAND() * 50))),
    ('Henry', 'Evans', FLOOR(1 + (RAND() * 50))),
    ('Isabella', 'Gonzalez', FLOOR(1 + (RAND() * 50))),
    ('Ethan', 'Brooks', FLOOR(1 + (RAND() * 50))),
    ('Chloe', 'Gray', FLOOR(1 + (RAND() * 50))),
    ('William', 'Jenkins', FLOOR(1 + (RAND() * 50))),
    ('Grace', 'Chang', FLOOR(1 + (RAND() * 50))),
    ('Alexander', 'Hall', FLOOR(1 + (RAND() * 50))),
    ('Zoe', 'Allen', FLOOR(1 + (RAND() * 50))),
    ('Jacob', 'Sanchez', FLOOR(1 + (RAND() * 50))),
    ('Charlotte', 'Wright', FLOOR(1 + (RAND() * 50))),
    ('Eli', 'Martinez', FLOOR(1 + (RAND() * 50))),
    ('Ruby', 'Bennett', FLOOR(1 + (RAND() * 50))),
    ('Samuel', 'Wood', FLOOR(1 + (RAND() * 50))),
    ('Victoria', 'Diaz', FLOOR(1 + (RAND() * 50))),
    ('Matthew', 'Ramirez', FLOOR(1 + (RAND() * 50))),
    ('Mia', 'Hernandez', FLOOR(1 + (RAND() * 50))),
    ('Liam', 'Gonzalez', FLOOR(1 + (RAND() * 50))),
    ('Caden', 'Parker', FLOOR(1 + (RAND() * 50))),
    ('Ella', 'Morris', FLOOR(1 + (RAND() * 50))),
    ('Sebastian', 'Rodriguez', FLOOR(1 + (RAND() * 50))),
    ('Daniel', 'Murphy', FLOOR(1 + (RAND() * 50))),
    ('Emma', 'Cook', FLOOR(1 + (RAND() * 50))),
    ('Joshua', 'Stewart', FLOOR(1 + (RAND() * 50))),
    ('Lily', 'Flores', FLOOR(1 + (RAND() * 50))),
    ('Oscar', 'Graham', FLOOR(1 + (RAND() * 50))),
    ('Harper', 'Kim', FLOOR(1 + (RAND() * 50))),
    ('Grace', 'Hughes', FLOOR(1 + (RAND() * 50)));