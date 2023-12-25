const { User, PasswordResetModel } = require("../model/expense");
const Sib = require("sib-api-v3-sdk");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.Api_key;
const sender = {
  email: "abc@gmail.com",
  name: "Expense Tracker App",
};

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

const postForgetPassword = async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(409).json({ error: "User does not exist" });
    } else {
      const token = generateToken();
      const reset = await PasswordResetModel.create({
        isActive: true,
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), 
      });
      const resetLink = `http://localhost:3000/password/resetpassword/${reset.id}/${token}`;
      const htmlContent = `<p>Please click on the link to reset your password.
    If not done by you, please change your password.</p>
    <a href="${resetLink}">Reset link</a>`;

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const receivers = [{ email: email }];
      const response = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Password Reset Link",
        textContent: `Please click on the link to reset your password.
                    If not done by you, please change your password.`,
        htmlContent: htmlContent,
      });
      console.log(response);
      return res.status(200).json({response,success:true});
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




// controllers/passwordController.js

const confirmResetPassword = async (req, res) => {
  const resetId = req.params.resetId;
  const token = req.params.token;
  const newPassword = req.body.newPassword;
  console.log("Reset ID:", resetId);
  console.log("Token:", token);
  
  try {
    // Find the PasswordReset record by resetId and token
    const resetRecord = await PasswordResetModel.findOne({
      where: { id: resetId, token: token, isActive: true },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Find the user associated with the reset record
    const user = await User.findByPk(resetRecord.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await user.update({ password: hashedPassword });

    // Deactivate the reset record
    await resetRecord.update({ isActive: false });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error confirming password reset:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





module.exports={
  postForgetPassword ,confirmResetPassword
}