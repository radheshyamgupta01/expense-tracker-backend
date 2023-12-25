const express=require("express")
const authenticateToken=require("../middleware/middleware")
const {createExpense, getAllExpense, deleteExpense ,editExpense,Pagination}= require("../controllers/expense")
const router=express.Router()
router.post("/createExpense", authenticateToken,createExpense);
router.get("/getAll",authenticateToken,getAllExpense);

router.delete("/delete/:id", deleteExpense );
router.put("/edit/:id", authenticateToken,editExpense)
router.get("/pagination",Pagination)

module.exports=router