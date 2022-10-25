const express = require("express")
const {checkOut , paymentVerification , getKey} = require("../controller/paymentController.js")
const router = express.Router()

router.post("/payment" , checkOut)

router.post("/paymentVerification", paymentVerification)

router.get("/getKey" , getKey)

module.exports = router