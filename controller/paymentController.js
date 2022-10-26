require("dotenv").config()
const Razorpay = require("razorpay")
const crypto = require("crypto");
const paymentModel = require("../models/paymentModels")

const checkOut = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
      currency: "INR"
    };
    const order = await instance.orders.create(options);
    res.status(200).send({
      success: true,
      order
    })
  }
  catch (error) {
    res.status(500).send({ error })
  }
}

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature

  if (isAuthentic) {
    await paymentModel.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    })
    res.redirect(
      `https://payment-2vcq.onrender.com/paymentSuccess?reference=${razorpay_payment_id}`
    )
  } else {
    res.status(400).send({
      success: false
    })
  }
}

const getKey = async (req, res) => {
  res.status(200).send({
    key: process.env.RAZORPAY_KEY_ID
  })
}

module.exports = { checkOut, paymentVerification, getKey }
