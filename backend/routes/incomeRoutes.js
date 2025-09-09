    const express = require("express");
    const { addIncome, getIncomes, deleteIncome,getIncomeExcel } = require("../controllers/IncomeController");
    const {protect} = require("../middlewares/authMiddleware")


    const router = express.Router();



    router.post("/add",protect,addIncome);
    router.get("/get",protect,getIncomes);
    router.delete("/:id",protect,deleteIncome);
    router.get("/excel",protect,getIncomeExcel);



    module.exports = router;