const { Expense, User, Login_data } = require("../model/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize2 } = require("../database/db");
const ragister = async (req, res) => {
  try {
    const { FirstName, LastName, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "user already exists with this email id " });
    }
    const hasPassword = await bcrypt.hash(password, 10);
    const userCreated = await User.create({
      firstName: FirstName,
      lastName: LastName,
      email: email,
      password: hasPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userCreated,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ detail: err, error: "internal server error " });
  }
};

const Login = async (req, res) => {
  try {
    const { password, email } = req.body;

    const user = await Login_data.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "password is invalid" });
    }

    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ detail: err, error: "internal server error" });
  }
};

const getAllUser = async (req, res) => {
  // try {
  //   // Fetch all users and their associated expenses
  //   const fetchedAllUser = await User.findAll({
  //     include: Expense, // Assuming there is an association between User and Expense models
  //   });

  //   // Calculate the total expense amount for each user
  //   const userLeaderboard = fetchedAllUser.map((user) => {
  //     console.log("User:", user.toJSON()); // Log the user data
  //     let totalExpenseAmount = 0;

  //     // Use a for loop to calculate the total expense amount
  //     if (user.expenses) {
  //       for (const expense of user.expenses) {
  //         totalExpenseAmount += parseInt(expense.amount, 10);
  //       }
  //     }
  //     return {
  //       id: user.id,
  //       username: user.lastName,
  //       totalExpenseAmount,
  //     };
  //   });

  //   // Sort users based on their total expense amounts (descending order)
  //   userLeaderboard.sort((a, b) => b.totalExpenseAmount - a.totalExpenseAmount);
  //   for (var i = 0; i < userLeaderboard.length; i++) {
  //     console.log(
  //       userLeaderboard[i].totalExpenseAmount,
  //       userLeaderboard[i].username
  //     );
  //   }
  //   // Send the user leaderboard data as a response
  //   return res.status(200).json({ userLeaderboard });
  // } catch (err) {
  //   console.error("Error while fetching user leaderboard:", err);
  //   res.status(500).json({
  //     error: "Internal server error while fetching user leaderboard",
  //   });
  // }
  try {
    const userLeaderboard = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "totalExpense",
        // [sequelize2.fn('SUM', sequelize2.col('expenses.amount')), 'totalExpenseAmount'],
      ],
      order: [["totalExpense", "DESC"]],
      // include: [{
      //   model: Expense,
      //   attributes: [], // Included only necessary columns from the Expense model
      // }],
      // group: ['user.id', 'user.lastName'], // Group by both user.id and user.lastName
      // order: [[sequelize2.literal('totalExpenseAmount'), 'DESC']],
    });

    // Send the user leaderboard data as a JSON response
    res.status(200).json({ userLeaderboard });
  } catch (err) {
    console.error("Error while fetching user leaderboard:", err);
    res.status(500).json({
      error: "Internal server error while fetching user leaderboard",
    });
  }
};
module.exports = {
  ragister,
  Login,
  getAllUser,
};
