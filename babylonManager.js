var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    taskList();
});

function taskList() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    productSearch();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add to Inventory":
                    inventory();
                    break;
                case "Add New Product":
                    newProduct();
                    break;
            }
        });
}

function productSearch() {
    connection.query("SELECT item_id, product_name, department_name, stock_quantity, price FROM products",
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(
                    "ID: " + res[i].item_id +
                    " || Product_name: " + res[i].product_name +
                    " || Department_name: " + res[i].department_name +
                    " || Price: $" + res[i].price +
                    " || Quantity: " + res[i].stock_quantity
                );
            }
            connection.end();
        })
}

function lowInventory() {
    console.log("Success!");
    connection.query("SELECT item_id, product_name, stock_quantity, department_name FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(
                    "ID: " + res[i].item_id +
                    " || Product_name: " + res[i].product_name +
                    " || Department_name: " + res[i].department_name +
                    " || Quantity: " + res[i].stock_quantity
                );
            }
            connection.end();
        })
}

function inventory() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            var proArray = [];
            var stockArray = [];
            for (var i = 0; i < res.length; i++) {
                proArray.push(res[i].product_name);
                stockArray.push(res[i].stock_quantity);
            }
            inquirer
                .prompt([
                    {
                        type: "rawlist",
                        name: "quantList",
                        message: "Which item would you like to add inventory too?",
                        choices: proArray
                    },
                    {
                        type: "input",
                        name: "quant",
                        message: "How much would you like to add?"
                    }
                ]).then(function (quantAdd) {
                    console.log(quantAdd.quantList);
                    console.log(quantAdd.quant);
                    var oldQuant = stockArray[proArray.indexOf(quantAdd.quantList)];
                    var newQuant = parseInt(quantAdd.quant) + oldQuant;
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuant
                            },
                            {
                                product_name: quantAdd.quantList
                            }
                        ]
                    );
                    connection.end();
                });
        }
    )
}

function newProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "product",
                message: "What product would you like to add?"
            },
            {
                type: "input",
                name: "department",
                message: "What department is this product in?"
            },
            {
                type: "input",
                name: "stock",
                message: "How much would you like to stock?"
            },
            {
                type: "input",
                name: "price",
                message: "How much will each item cost?"
            }
        ]).then(function (newProduct) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: newProduct.product,
                    department_name: newProduct.department,
                    stock_quantity: newProduct.stock,
                    price: newProduct.price
                }
            )
            connection.end();
        })
};



