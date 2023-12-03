const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
    const data = await User.find();
    res.send(data);
});

module.exports = router;
