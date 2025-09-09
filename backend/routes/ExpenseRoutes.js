const express = require("express");
const { addExpense, getExpenses, deleteExpense ,downloadExpenseExcel} = require("../controllers/expenseController.js");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware.js");


router.post("/add",protect,addExpense);
router.get("/get",protect,getExpenses);
router.delete("/:id",protect,deleteExpense); 
router.get("/excel",protect,downloadExpenseExcel);   

module.exports = router;