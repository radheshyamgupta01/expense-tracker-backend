const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const port = 30001;
app.use(bodyParser.json());
const bcrypt = require("bcrypt");
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require("cors");
app.use(cors());
const expenseRoute = require("./routes/expense");
const usersRoute = require("./routes/users");
const forgetPassword = require('./routes/forget-password');
const paymentRoutes = require("./routes/payment");
app.use("/user", usersRoute);
app.use("/expense", expenseRoute);
app.use("/forgot",forgetPassword)
app.use('/api/payment', paymentRoutes);

app.listen(port);
