// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const port = 30001;
// app.use(bodyParser.json());
// const bcrypt = require("bcrypt");
// app.use(bodyParser.urlencoded({ extended: false }));
// const cors = require("cors");
// app.use(cors());
// const expenseRoute=require("./routes/expense-route")
// app.use("/expense",expenseRoute)
// const { Sequelize, DataTypes, where } = require("sequelize");
// // const { use } = require("./routes/users");
// 
// const expense = sequelize.define("user", {
//   fistName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   lastName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });
// const Login = sequelize.define("login", {
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });
// sequelize
//   .sync()
//   .then((res) => console.log("databse is synchronize"))
//   .catch((err) => console.log("err"));
// app.post("/createSignin", async (req, res) => {
//   try {
//     const { FirstName, LastName, email, password } = req.body;
//     const existingUser = await expense.findOne({ where: { email: email } });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ error: "user already exists with this email id " });
//     }
//     const hasPassword = await bcrypt.hash(password, 10);
//     const userCreated = await expense.create({
//       fistName: FirstName,
//       lastName: LastName,
//       email: email,
//       password: hasPassword,
//     });
//     return res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       user: userCreated,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ detail: err, error: "internal server error " });
//   }
// });
// app.post("/createLogin", async (req, res) => {
//     try{
//         const { password, email } = req.body;
//         const user = await expense.findOne({ where: { email: email } });
//         if (!user) {
//          return  res.status(404).json({ error: " user  not found " });
//         }
//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//            return res.status(401).json({ error: "password is invalid " });
//         }
//         res.send({ massage: "log in successfull" });
//     }
//     catch(err){
//         res.status(500).json({detail:err,error:"internal servar error "})
//     }
  
// });

// app.listen(port);
