const express = require("express");
const router = express.Router();

const {   ragister, Login} = require("../controllers/user");
const {getAllUser}=require("../controllers/user")

router.post("/createSignin",ragister);
router.post("/createLogin", Login);
// leaderboard route
router.get("/getAllUser",getAllUser)

module.exports = router;
