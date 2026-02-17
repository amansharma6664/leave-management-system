-- Create database
CREATE DATABASE IF NOT EXISTS leave_management_db;
USE leave_management_db;

-- Tables will be auto-created by Hibernate, but you can run this to insert demo users

-- Insert demo users (passwords are BCrypt hashed for 'password')
-- Note: The application will create tables automatically, so you only need to insert users after first run

-- Demo Employee
-- INSERT INTO users (username, email, password, full_name, department, leave_balance, enabled, created_at, updated_at)
-- VALUES ('employee', 'employee@company.com', '$2a$10$XptfskLsT0wq4fHJH6nJiO5hFZ2VXqjEtVqYHXxXxXxXxXxXxXxXx', 
--         'John Employee', 'IT Department', 20.0, true, NOW(), NOW());

-- INSERT INTO user_roles (user_id, role) VALUES (1, 'EMPLOYEE');

-- Demo Manager
-- INSERT INTO users (username, email, password, full_name, department, leave_balance, enabled, created_at, updated_at)
-- VALUES ('manager', 'manager@company.com', '$2a$10$XptfskLsT0wq4fHJH6nJiO5hFZ2VXqjEtVqYHXxXxXxXxXxXxXxXx', 
--         'Jane Manager', 'Management', 20.0, true, NOW(), NOW());

-- INSERT INTO user_roles (user_id, role) VALUES (2, 'MANAGER');

-- Note: Use the register endpoint to create demo users with password 'password'
-- Or update the password hash with proper BCrypt encoding
