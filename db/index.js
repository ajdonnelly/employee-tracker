const db = require("./database");

// You may want to use a separate file containing functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these.

class ROUTES {
    constructor(db) {
        this.db = db;
      }
      //get all employees-
        //showing employee data, including employee ids, first names, 
        //last names, job titles, departments, salaries, and managers 
        //that the employees report to
getEmp(){return this.db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;");}
      //get all employees by department
// getEmpDept(){return this.db.promise().query('SELECT ;');}
//       //get all employees by manager
// getEmpMan(){return this.db.promise().query('SELECT ;');}
// getAddEmp(){return this.db.promise().query('SELECT ;');}
// getRemEmp(){return this.db.promise().query('SELECT ;');}
//Update an employee's role
getUpdateEmpRole(employeeId, roleId) {return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?",[roleId, employeeId]);}
updateEmpMan(employeeId, managerId) {return this.connection.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?",[managerId, employeeId]);}
// roles(){return this.db.promise().query('SELECT ;');}
// addRole(){return this.db.promise().query('SELECT ;');}
remRole(roleId){return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);}
//Get all departments
getDepts() {return this.db.promise().query('SELECT department.id, department.name FROM department;');}
// adddepts(){return this.db.promise().query('SELECT ;');}
// remdept(){return this.db.promise().query('SELECT ;');}
// budget(){return this.db.promise().query('SELECT ;');}
// quit(){return this.db.promise().query('SELECT ;');}
findAllEmpByDept(departmentId) {return this.connection.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;',departmentId);}
findAllEmpByMan(managerId) {return this.db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;',managerId);}
findRoles() {return this.connection.promise().query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;");}
addNewEmp(employee) {return this.connection.promise().query("INSERT INTO employee SET ?", employee);}
remEmployee(employeeId) {return this.connection.promise().query("DELETE FROM employee WHERE id = ?",employeeId);}
findAllManagers(employeeId){return this.connection.promise().query("SELECT id, first_name, last_name FROM employee WHERE id != ?",employeeId);} 
createNewRole(role) {return this.connection.promise().query("INSERT INTO role SET ?", role);}
addNewDepartment(department) {return this.connection.promise().query("INSERT INTO department SET ?", department);}
delDept(departmentId) {return this.connection.promise().query("DELETE FROM department WHERE id = ?",departmentId);}
viewBudgets(){return this.connection.promise().query("SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;");}
} 
module.exports = new ROUTES(db);