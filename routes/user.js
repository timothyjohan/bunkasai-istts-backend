const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { loginAndRegister } = require("../controllers/controller");

// router.get("/", async (req, res) => {
//     const data = await User.find();
//     res.send(data);
// });

router.get("/", loginAndRegister);

module.exports = router;
