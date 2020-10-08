const db = require("./database");

// You may want to use a separate file containing functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these.

class ROUTES {
    constructor(db) {
        this.db = db;
      }
getEmp(){return this.db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;");}
updateEmpRole(employeeId, roleId) {return this.db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?",[roleId, employeeId]);}
updateEmpMan(employeeId, managerId) {return this.db.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?",[managerId, employeeId]);}
remRole(roleId){return this.db.promise().query("DELETE FROM role WHERE id = ?", roleId);}
getDepts() {return this.db.promise().query('SELECT department.id, department.name FROM department;');}
findAllEmpByDept(departmentId) {return this.db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;',departmentId);}
findAllEmpByMan(managerId) {return this.db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;',managerId);}
findRoles() {return this.db.promise().query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;");}
addNewEmp(employee) {return this.db.promise().query("INSERT INTO employee SET ?", employee);}
remEmployee(employeeId) {return this.db.promise().query("DELETE FROM employee WHERE id = ?",employeeId);}
findAllManagers(employeeId){return this.db.promise().query("SELECT id, first_name, last_name FROM employee WHERE id != ?",employeeId);} 
createNewRole(role) {return this.db.promise().query("INSERT INTO role SET ?", role);}
addNewDepartment(department) {return this.db.promise().query("INSERT INTO department SET ?", department);}
delDept(departmentId) {return this.db.promise().query("DELETE FROM department WHERE id = ?",departmentId);}
viewBudgets(){return this.db.promise().query("SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;");}
} 
module.exports = new ROUTES(db);