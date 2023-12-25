
const express = require("express");
const authenticateToken =require("../middleware/middleware")
const router = express.Router();
const {
  purchaseMembership,
  transactionUpdate,
  failTransactionUpdate,
} = require("../controllers/razorpay");

router.post("/purchase-membership",  purchaseMembership);
router.post("/transaction-update", transactionUpdate);
router.post("/fail-transaction-update", failTransactionUpdate);

module.exports = router;

