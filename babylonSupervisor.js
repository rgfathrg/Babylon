var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    showOptions();
});

function showOptions() {
    inquirer
      .prompt([
          {
              type: "list",
              name: "options",
              message: "What would you like to do?",
              choices: ["View Product Sales by Department", "Create New Department"]
          }
      ]).then(function (action) {
          switch (action.options) {
              case "View Product Sales by Department":
                productView();
                break;
              case "Create New Department":
                newDepartment();
                break;
          }
      });
}

function productView() {
    connection.query("SELECT p.product_name, p.product_sales, d.department_name, d.over_head_costs FROM products AS p INNER JOIN departments AS d ON d.department_name = p.department_name ORDER BY department_name", function (err, res){
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}