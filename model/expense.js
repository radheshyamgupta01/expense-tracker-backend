const express = require("express");
const { sequelize2 } = require("../database/db");
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
// expense model
const Expense = sequelize2.define("expense", {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },

  catogary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

// User model
const User = sequelize2.define("user", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalExpense: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Login model
const Login_data = sequelize2.define("user", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// Order model
const Order = sequelize2.define("Order", {
  orderid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  paymentid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "PENDING",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});






const PasswordResetModel = sequelize2.define(
  "PasswordReset",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "password_resets", // Adjust the table name as needed
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);
// const ForgotPasswordRequests = sequelize2.define('ForgotPasswordRequests', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//   },
//   userId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: User,
//       key: 'id',
//     },

//   },
//   token: {
//     type: DataTypes.STRING, 
//     allowNull: false,
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },


// });







// Association
User.hasMany(Expense);
Expense.belongsTo(User);
// Association for Order
User.hasMany(Order, { foreignKey: "userId" });


Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(PasswordResetModel)
PasswordResetModel.belongsTo(User)

// User.prototype.createOrder = async function(orderData) {
//   const order = await Order.create(orderData);
//   await this.addOrder(order);
//   return order;
// };

const syncModels = async () => {
  try {
    await User.sync();
    console.log("user is synchronized");
    await Expense.sync();
    console.log("Expense is synchronized");
    await Order.sync();
    console.log("Order is synchronized");

  
    await PasswordResetModel.sync();
  
    console.log("forgot reset sync");
  } catch (err) {
    console.error("Error synchronizing database:", err);
  }
};

syncModels();

module.exports = {
  Expense,
  User,
  Login_data,
  Order,

  PasswordResetModel,
};
