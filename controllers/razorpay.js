const { Order } = require("../model/expense");
require("dotenv").config();

const Razorpay = require("razorpay");
// exports.purchaseMembership = async (req, res, next) => {
//   try {
//     console.log("membership is running");

//     const instance = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     var options = {
//       amount: Number(req.body.amount * 100),
//       currency: "INR",
//     };

//     const order = await instance.orders.create(options);

//     if (order) {
//       // Create a new order in the database with status "PENDING"
//       await Order.create({
//         orderid: order.id,
//         paymentid: null, // Assuming paymentid should initially be null
//         status: "PENDING",
//       });

//       return res.status(201).json({ order, key_id: instance.key_id });
//     }

//     if (order.error) {
//       console.error("Razorpay API error:", order.error);
//       return res
//         .status(401)
//         .json({ message: "Razorpay API error", error: order.error });
//     }

//   } catch (err) {
//     res.status(403).json({
//       message: "something went wrong while creating razorpay order",
//       error: err,
//     });
//   }
// };
exports.purchaseMembership = async (req, res, next) => {
  try {
    console.log("membership is running");

    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const orderCreated = await Order.create({
      orderid: order.id,
      paymentid: null,
      status: "PENDING",
      userId: "2",
    });

    return res.status(201).json({ order, key_id: instance.key_id });

    if (order.error) {
      console.error("Razorpay API error:", order.error);
      return res
        .status(401)
        .json({ message: "Razorpay API error", error: order.error });
    }
  } catch (err) {
    res.status(403).json({
      message: "something went wrong while creating razorpay order",
      error: err,
    });
  }
};

exports.transactionUpdate = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { payment_id, order_id } = req.body;
    // console.log(payment_id, order_id, "this is detail");

    // Create a new order in the database with status "PENDING"

    const order = await Order.findOne({ where: { orderid: order_id } });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order) {
      const updateOrder = await order.update({
        paymentid: payment_id,
        status: "succefull",
      });
      console.log("order upadated successfully ", updateOrder);
     return res.status(200).json({ updateOrder, status: "successful" });

    }
  } catch (err) {
    console.error("Error updating transaction:", err);
   

    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: err.message,
    });
  }
};

exports.failTransactionUpdate = async (req, res, next) => {
  try {
    
    const {  order_id } = req.body;
    console.log(order_id,">>>.geting oddjnnffdn")
    const order = await Order.findOne({ where: { orderid: order_id } });
    order
      .update({  status: "FAILED" })
      .then(() => res.status(403).json({ message: "Transaction Failed" }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error updating transaction" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating transaction", error: err });
  }
};

