const { where } = require("sequelize");
const { Expense, User } = require("../model/expense");
const jwt = require("jsonwebtoken");
const {sequelize2}=require("../database/db")

// const createExpense = async (req, res) => {
//   try {
//     const { description, amount, catogary } = req.body;
//     var userId = req.user.userId;

//     const expenseCreated = await Expense.create({
//       amount: amount,
//       description: description,
//       catogary: catogary,
//       userId: userId,
//     });

//     const user = await User.findByPk(userId);
//     if (user) {
//       user.totalExpense += parseInt(amount, 10);

//       await user.save();
//     }
    
//     if (expenseCreated) {
//       res.json(expenseCreated);
//     }
//   } catch (err) {
//     console.log("error  in creating expense");
//     res.status(500).json({ Error: "internal server error" });
//   }
 
// };
const createExpense = async (req, res) => {
  const t = await sequelize2.transaction();

  try {
    const { description, amount, catogary } = req.body;
    const userId = req.user.userId;

    // Create expense within the transaction
    const expenseCreated = await Expense.create(
      {
        amount: amount,
        description: description,
        catogary: catogary,
        userId: userId,
      },
      { transaction: t }
    );

    // Update user's totalExpense within the transaction
    const user = await User.findByPk(userId, { transaction: t });
    if (user) {
      user.totalExpense += parseInt(amount, 10);
      await user.save({ transaction: t });
    }

    // Commit the transaction if everything is successful
    await t.commit();

    res.json(expenseCreated);
  } catch (err) {
    // Rollback the transaction in case of an error
    await t.rollback();

    console.log("Error in creating expense:", err);
    res.status(500).json({ Error: "Internal server error" });
  }
};

// const getAllExpense = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const getAll = await Expense.findAll({
//       where: {
//         userId: userId,
//       },
//     });

//     return res.status(200).json(getAll);
//   } catch (err) {
//     console.error("Error fetching expenses:", err);
//     res.status(500).json({ Error: "internal server error" });
//   }
// };
const getAllExpense = async (req, res) => {
  const t = await sequelize2.transaction();

  try {
    const userId = req.user.userId;

    // Fetch expenses within the transaction
    const getAll = await Expense.findAll({
      where: {
        userId: userId,
      },
      transaction: t,
    });

    // Commit the transaction as it's a read-only operation
    await t.commit();

    return res.status(200).json(getAll);
  } catch (err) {
    // Rollback the transaction in case of an error
    await t.rollback();

    console.error("Error fetching expenses:", err);
    res.status(500).json({ Error: "Internal server error" });
  }
};


// const deleteExpense = async (req, res) => {
//   const expenseToDeleteId = req.params.id;

//   try {
//     const deleted = await Expense.destroy({
//       where: {
//         id: expenseToDeleteId,
//       },
//     });

//     if (deleted) {
//       console.log(deleted, "this is deleted");
//       res.json(deleted);
//     } else {
//       res.status(404).json({ Error: "Expense not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ Error: "Internal server error" });
//   }
// };
const deleteExpense = async (req, res) => {
  const expenseToDeleteId = req.params.id;
  const t = await sequelize2.transaction();

  try {
    const expense = await Expense.findByPk(expenseToDeleteId, { transaction: t });

    if (!expense) {
      await t.rollback(); // Rollback the transaction if expense is not found
      return res.status(404).json({ Error: "Expense not found" });
    }

    const deleted = await expense.destroy({ transaction: t });

    // Update user's totalExpense within the transaction
    const user = await User.findByPk(expense.userId, { transaction: t });
    if (user) {
      user.totalExpense -= expense.amount;
      await user.save({ transaction: t });
    }

    // Commit the transaction if everything is successful
    await t.commit();

    console.log(deleted, "this is deleted");
    res.json(deleted);
  } catch (err) {
    // Rollback the transaction in case of an error
    await t.rollback();

    console.error(err);
    res.status(500).json({ Error: "Internal server error" });
  }
};

// const editExpense = async (req, res) => {
//   try {
//     console.log("editeexpesne is running");
//     const editToExpense = req.params.id;
//     const userId = req.user.userId;
//     const { description, amount, catogary } = req.body;
//     console.log(description, amount, catogary, "ggg");
//     if (!description || !amount || !catogary) {
//       return res.status(400).json({ Error: "incomplete  data " });
//     }
//     // const editedExpenses =  await Expense.findByPk(editToExpense);
//     const editedExpenses = await Expense.findByPk({
//       where: {
//         id: editToExpense,
//       },
//     });
//     if (!editedExpenses) {
//       res.status(404).json({ Error: "expense not found" });
//     }
//     editedExpenses.amount = amount;
//     editedExpenses.description = description;
//     editedExpenses.catogary = catogary;
//     await editedExpenses.save();
//     res.json(editedExpenses);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ Error: "Internal server error" });
//   }
// };
const editExpense = async (req, res) => {
  const t = await sequelize2.transaction();

  try {
    console.log("editExpense is running");
    const expenseToEditId = req.params.id;
    const userId = req.user.userId;
    const { description, amount, catogary } = req.body;

    console.log(description, amount, catogary, "ggg");

    if (!description || !amount || !catogary) {
      await t.rollback(); // Rollback the transaction if data is incomplete
      return res.status(400).json({ Error: "Incomplete data" });
    }

    // Find the expense to edit within the transaction
    const editedExpense = await Expense.findByPk(expenseToEditId, { transaction: t });

    if (!editedExpense) {
      await t.rollback(); // Rollback the transaction if expense is not found
      return res.status(404).json({ Error: "Expense not found" });
    }

    // Update the expense details
    editedExpense.amount = amount;
    editedExpense.description = description;
    editedExpense.catogary = catogary;

    // Save the changes within the transaction
    await editedExpense.save({ transaction: t });

    // Commit the transaction if everything is successful
    await t.commit();

    res.json(editedExpense);
  } catch (err) {
    // Rollback the transaction in case of an error
    await t.rollback();

    console.error(err);
    res.status(500).json({ Error: "Internal server error" });
  }
};
const Pagination=async(req,res)=>{
  console.log("pagination is running")
  try{
    const paginationData= await Expense.findAll()
console.log(paginationData)
    if (!paginationData) {
      res.status(400).json({ message: "data not found" });
    }
    

    res.status(200).json(paginationData)
  }
  catch(err){
    console.error(err)
    res.status(500).json({error:"Internal server error"})
  }
 

}


module.exports = { createExpense, getAllExpense, deleteExpense, editExpense,Pagination };
