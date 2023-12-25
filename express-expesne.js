
// // note - this is the  express  expense taks 

// const express = require("express");
// const app = express();
// const port = 5000;
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { Sequelize, DataTypes } = require("sequelize");
// const blogRoute = require("./routes/users");

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Sequelize setup


// const expense = sequelize.define("expense", {
//   expenseData: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   expenseDataValue: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
// });

// // Sync the database
// sequelize
//   .sync()
//   .then((res) => console.log("Database is synchronized"))
//   .catch((err) => console.log("Error in syncing the database:", err));

// // Route to create expense
// const createExpense = async (req, res) => {
//   try {
//     const { expenseData, expenseDataN } = req.body;
//     //  console.log(expenseData, expenseDataN)
//     const newExpense = await expense.create({
//       expenseData: expenseData,
//       expenseDataValue: expenseDataN,
//     });
//     // console.log(newExpense)
//     res.json(newExpense);
//   } catch (err) {
//     console.error("Error creating expense:", err);
//     res.status(500).json({ error: "Internal server error", details: err });
//   }
// };
// // Route to fetch all expenses
// const getAllExpenses = async (req, res) => {
//   try {
//     const allExpenses = await expense.findAll();
//     res.json(allExpenses);
//   } catch (err) {
//     console.error("Error fetching expenses:", err);
//     res.status(500).json({ error: "Internal server error", details: err });
//   }
// };

// // Route to delete an expense by ID
// const deleteExpense = async (req, res) => {
//   try {
//     const expenseId = req.params.id;
//     console.log(expenseId,"this is id")
//     const deletedExpense = await expense.destroy({
//       where: {
//         id: expenseId,
//       },
//     });

//     if (deletedExpense) {
//       console.log(deleteExpense,"deleted ")
//       res.json({ message: "Expense deleted successfully" });
//     } else {
//       res.status(404).json({ error: "Expense not found" });
//     }
//   } catch (err) {
//     console.error("Error deleting expense:", err);
//     res.status(500).json({ error: "Internal server error", details: err });
//   }
// };
// // Route to update an expense
// // Route to update an expense
// app.put("/updateExpense/:id", async (req, res) => {
//   try {
//     const expenseId = req.params.id;
//     const { expenseData, expenseDataValue } = req.body;

//     // Validate input
//     if (!expenseData || !expenseDataValue) {
//       return res.status(400).json({ error: "Expense data is incomplete" });
//     }

//     // Find the expense by ID
//     const existingExpense = await expense.findByPk(expenseId);

//     if (!existingExpense) {
//       return res.status(404).json({ error: "Expense not found" });
//     }

//     // Update the expense data
//     existingExpense.expenseData = expenseData;
//     existingExpense.expenseDataValue = expenseDataValue;

//     // Save the updated expense
//     await existingExpense.save();

//     res.json(existingExpense);
//   } catch (err) {
//     console.error("Error updating expense:", err);
//     res.status(500).json({ error: "Internal server error", details: err });
//   }
// });

// // Route for deleting an expense
// app.delete("/deleteExpense/:id", deleteExpense);

// app.get("/getAllExpenses", getAllExpenses);

// // Route for blog
// app.use("/blog", blogRoute);

// // Route to create expense
// app.post("/createExpense", createExpense);

// // Listening to the port
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// exports.transactionUpdate = async (req, res, next) => {
//     try {
//       const { payment_id, order_id } = req.body;
//       const order = await Order.findOne({ where: { orderid: order_id } });
  
//       const promise1 =  order.update({ paymentid: payment_id, status: "SUCCESSFULL" });
   
//       const promise2 =  req.user.update({ isPremiumUser: true });

//       Promise.all([promise1, promise2])
//         .then(() => res.status(202).json({ success: true, message: "Transaction Successful" }))
//         .catch((err) => {
//           console.log(err);
//           res.status(500).json({ success: false, message: "Error updating transaction" });
//         });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ success: false, message: "Error updating transaction" });
//     }
//   };
  
//   exports.failTransactionUpdate = async (req , res, next) => {
//     try {
//       console.log(req.body.order_id)
//       const { payment_id, order_id } = req.body;
//       const order = await Order.findOne({ where: { orderid: order_id } });
//       order.update({paymentid: payment_id, status: "FAILED" })
//         .then(() => res.status(403).json({ message: 'Transaction Failed' }))
//         .catch((err) => {
//           console.log(err);
//           res.status(500).json({ message: 'Error updating transaction' });
//         });
//     } catch(err) {
//       console.log(err);
//       res.status(500).json({ message: 'Error updating transaction' });
//     }
//   };
