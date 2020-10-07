const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

// runPrompts();
run();

function run() {
    runPrompts();
}

function runPrompts() {
prompt([
{
  type: 'list',
  name: 'choice',
  message: 'What would you like to do?',
  choices: [
    //view all employees, 
    {
      name: "View All Employees",
      value: "emp"
    },
    // Bonus: View employees by department.
    {
      name: "View All Employees By Department",
      value: "empdept"
    },
    // Bonus: View employees by manager.
    {
      name: "View All Employees By Manager",
      value: "empman"
    },

     //add an employee, 
    {
      name: "Add Employee",
      value: "addemp"
    },

    //Bonus: Delete employees
    {
      name: "Remove Employee",
      value: "rememp"
    },

         //update an employee role
    {
      name: "Update Employee Role",
      value: "updateemprole"
    },

    // Bonus: Update employee managers.
    {
      name: "Update Employee Manager",
      value: "updateempman"
    },

      //view all roles, 
    {
      name: "View All Roles",
      value: "roles"
    },

     //add a role,
    {
      name: "Add Role",
      value: "addrole"
    },

    //Bonus: Delete roles
    {
      name: "Remove Role",
      value: "remrole"
    },

    //view all departments, 
    {
      name: "View All Departments",
      value: "depts"
    },

    //add a department, 
    {
      name: "Add Department",
      value: "adddepts"
    },

    // Bonus: Delete departments
    {
      name: "Remove Department",
      value: "deldept"
    },

    // View the total utilized budget of a department—i.e., the combined salaries of all employees in that department.
    {
      name: "View Total Utilized Budget By Department",
      value: "budget"
    },

    //Exit App
    {
      name: "Exit",
      value: "exit"
    }
  ]
}
]).then(answers => {
  let selection = answers.selection;
  switch (selection) {
    case 'emp':
      emp();
      break;
    case 'empdept':
      empDept();
      break;
    case 'empman':
      empMan();
      break;
    case 'addemp':
      addEmp();
      break;
    case 'rememp':
      remEmp();
      break;
    case 'updateemprole':
      updateEmpRole();
      break;
    case 'updateempman':
      updateEmpMan();
      break;
    case 'roles':
        roles();
      break;
    case 'addrole':
      addRole();
      break;
    case 'remrole':
      remRole();
      break;
    case 'depts':
        depts();
      break;
    case 'adddepts':
        addDepts();
      break;
    case 'deldept':
        delDept();
      break;
    case 'budget':
        budget();
        break;
    default:
        exit();
      }
  }
)

}
//view employees
function emp(){
    db.getEmp()
    .then( ([rows]) => {
      let employees = rows;
      console.table(employees);
    }).then( () => runPrompts());
}
//get all employees by department
function empDept() {
//need to let them choose the department with a prompt
db.getDepts()
.then( ([rows]) => {
    let departments = rows;
    const selectDepartment =  departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Choose a department",
          choices: selectDepartment
        }
      ])
  //then create a function returning the employees in that selected dept    
  .then(res => db.findAllEmpByDept(res.departmentId))
  .then( ([rows]) => {
    let employees = rows;
    console.table(employees);
  }).then( () => runPrompts());
});

}
//Find all empployees by the manager to which they report
function empMan() {
   //get all managers first through employees
    db.getEmp() 
    .then(([rows]) => {
        //store employees table as managers
        let managers = rows;
        //store manager rows to const selectManager
        const selectManager = managers.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
//allow them to choose a manager and then pull the 
        prompt([
            {
            type: "list",
            name: "managerId",
            message: "Choose a manager to find their employees",
            choices: selectManager
            }
        ])
//then return the employees reporting to that selected manager    
        .then(res => db.findAllEmpByMan(res.managerId))
        .then( ([rows]) => {
          let employees = rows;
        if (employees.length === 0) {
            console.log("No one reports to this person");
          } else {
            console.log(employees);
          }
        })
        .then( () => runPrompts())
        });
        
}
//Add an Employee
function addEmp(){
    prompt([
        {
          name: "first_name",
          message: "Please provide first name of the employee you would like to add"
        },
        {
          name: "last_name",
          message: "Please provide last name of the employee you would like to add"
        }
      ])
      .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.findRoles()
        .then(([rows]) => {
          let roles = rows;
          const SelectRole = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "Please give the employee's role?",
            choices: SelectRole
          })
          .then(res => {
            let roleId = res.roleId;

            db.getEmp()
                .then(([rows]) => {
                  let employees = rows;
                  const selectManager = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  })); 
            
                  selectManager.unshift({ name: "None", value: null });
                  
                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who manages this employee?",
                    choices: selectManager
                  })
                  .then(res => {
                    let employee = {
                      manager_id: res.managerId,
                      role_id: roleId,
                      first_name: firstName,
                      last_name: lastName
                    }

                    db.addNewEmp(employee);
                  })
                  .then(() => console.log(
                    `${firstName} ${lastName} has been added`
                  ))
                  .then(() => runPrompts())
                })
            })
        })
    })
}
//Delete an Employee
function remEmp(){
//prompt user to select a specific employee
db.getEmp()
                .then(([rows]) => {
                  let employees = rows;
                  const selectEmployee = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  })); 

                  prompt([
                    {
                      type: "list",
                      name: "employeeId",
                      message: "Select the employee you would like to remove?",
                      choices: selectEmployee
                    }
                  ])
 //run that selected employee through a delete employee function                 
                    .then(res => db.remEmployee(res.employeeId))
                    .then(() => console.log("The employee you've selected has been removed"))
                    .then(() => runPrompts())
                })

}
//Update an employees role
function updateEmpRole() {
//find employee by Id
  db.getEmp()
                .then(([rows]) => {
                  let employees = rows;
                  const selectEmployee = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  })); 

                  prompt([
                    {
                      type: "list",
                      name: "employeeId",
                      message: "Please select the employee whose role you would like to update.",
                      choices: selectEmployee
                    }
                  ])
 //run that selected employee through a delete employee function                 
                    .then(res => {
                        let employeeId = res.employeeId;
                        db.findRoles()
                        .then(([rows]) => {
                            let roles = rows; 
                            const selectRole = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                              }));

                              prompt([
                                  {
                                    type: "list",
                                    name: "roleId",
                                    message: "Select the role that you want to assign to the selected employee",
                                    choices: selectRole
                                  }
                              ])
                              //run that employeeId through an update employee role function
                              .then(res => db.updateEmpRole(employeeId, res.roleId))
                              .then(() => console.log("Updated the employee's role"))
                              .then(() => runPrompts())
                            });
                        });
                    })
}
        
//Update the manager assigned to an employee
function updateEmpMan(){
    //search through all employees
    db.getEmp()
    .then(([rows]) => {
      let employees = rows;
      const selectEmployee = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      })); 

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select an employee who you would like to assign a new manager to.",
          choices: selectEmployee
        }
      ])
        .then(res => {
          let employeeId = res.employeeId
          db.findAllManagers(employeeId)
            .then(([rows]) => {
              let managers = rows;
              const selectManager = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "managerId",
                  message:
                    "Select a new manager.",
                  choices: selectManager
                }
              ])
                .then(res => db.updateEmpMan(employeeId, res.managerId))
                .then(() => console.log("Employee's manager has been Updated"))
                .then(() => runPrompts())
            })
        })
    })
}
//Show all roles
function roles(){
    db.findRoles()
    .then(([rows]) => {
      let roles = rows;
      console.table(roles);
    })
    .then(() => runPrompts());
}
//Add a role to Roles
function addRole(){
    //get all departments 
    db.getDepts()
.then( ([rows]) => {
    let departments = rows;
    const selectDepartment =  departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));
 //prompt user as to which department to add a role to
      prompt([
        {
            name: "title",
            message: "Provide a new title."
          },
          {
            name: "salary",
            message: "Provide a salary for the new title."
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the new title belong to?",
            choices: selectDepartment
          }
      ])
    //run prompt repsonses through function to create new role
    .then(role => {
        db.createNewRole(role)
          .then(() => console.log(`${role.title} has been added`))
          .then(() => runPrompts())
      })
    
})
}
//Delete a role
function remRole(){
    db.findRoles()
    .then(([rows]) => {
      let roles = rows;
      const selectRole = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "roleId",
          message:
            "Select a role to remove",
          choices: selectRole
        }
      ])
        .then(res => db.remRole(res.roleId))
        .then(() => console.log("Removed role from the database"))
        .then(() => runPrompts())
    })
}
//View departments
function depts(){
    db.getDepts()
        .then( ([rows]) => {
            let departments = rows;
            console.table(departments);
        }).then( () => runPrompts());
}
//Add a department
function addDepts(){
    prompt([
        {
          name: "name",
          message: "Please provide the name of the new Department?"
        }
      ])
        .then(res => {
          let name = res;
          db.addNewDepartment(name)
            .then(() => console.log(`New Department Added`))
            .then(() => runPrompts())
        })
}
//Delete a Department
function delDept(){
    db.getDeparts()
    .then(([rows]) => {
      let departments = rows;
      const selectDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      prompt({
        type: "list",
        name: "departmentId",
        message:
          "Which department would you like to remove?",
        choices: selectDepartment
      })
        .then(res => db.delDept(res.departmentId))
        .then(() => console.log(`Department Removed`))
        .then(() => runPrompts())
    })
}
function budget(){
    db.viewBudgets()
    .then(([rows]) => {
      let departments = rows;
      console.table(departments);
    }).then(() => runPrompts());
}
function exit(){
    console.log("Program closing");
    process.exit();
}

