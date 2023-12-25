require("dotenv").config();
const { Sequelize } = require("sequelize");

const Razorpay = require("razorpay");
const sequelize2 = new Sequelize(
  process.env.db_name_2,
  process.env.db_user_2,
  process.env.db_password_2,
  {
    host: process.env.db_host_2,
    dialect: process.env.db_dialect_2,
  }
);

const rzpKey = process.env.RAZORPAY_KEY_ID;
const rzpSecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: rzpKey,
  key_secret: rzpSecret,
});

module.exports = {
  sequelize2,
  razorpay,
};
