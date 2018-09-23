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
    showInventory();
});

function showInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquiry();
    })
}

function inquiry() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "id_choice",
                message: "Which item would you like? Please input id:"
            },
            {
                type: "input",
                name: "quantity",
                message: "How many items would you like?"
            }
        ]).then(function (choice) {
            var choiceId = choice.id_choice;
            var quantity = choice.quantity;
            connection.query("SELECT product_name, stock_quantity, price FROM products WHERE item_id = " + choiceId, function (err, res) {

                if (err) throw err;
                console.log(res[0].product_name);
                console.log(res[0].stock_quantity);
                var newQuantity = res[0].stock_quantity - quantity;
                var purchasePrice = res[0].price * quantity;
                if (res[0].stock_quantity > 0) {
                    if (newQuantity > 0) {
                        console.log("Your order was successful!");
                        console.log("Your order total is: $" + purchasePrice);
                        connection.query("UPDATE products SET ? WHERE item_id = " + choiceId,
                            [
                                {
                                    stock_quantity: newQuantity,
                                    product_sales: purchasePrice
                                }
                            ]
                        );
                        connection.end();
                    }
                    else if (newQuantity === 0) {
                        console.log("Your order was succesful!");
                        console.log("Your order total is: " + purchasePrice);
                        connection.query("UPDATE products SET ? WHERE item_id = " + choiceId,
                            [
                                {
                                    stock_quantity: newQuantity,
                                    product_sales: purchasePrice
                                }
                            ]
                        );
                        console.log("This item is now out of stock!");
                        connection.end();
                    }
                    else {
                        console.log("Your order quantity is too large.");
                        showInventory();
                    }
                   
                }
                else {
                    console.log("Sorry this item is out of stock!");
                    showInventory();
                }
            }
            )
        })
}

