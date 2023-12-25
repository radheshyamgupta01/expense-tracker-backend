const express = require('express');
const router = express.Router();

const { postForgetPassword ,confirmResetPassword} = require("../controllers/forget-password");

router.post('/password/forgotpassword', postForgetPassword);

router.post('/password/resetpassword/:resetId/:token', confirmResetPassword);






module.exports = router;