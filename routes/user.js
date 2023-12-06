const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_KEY = "proyek2gatel";

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        password: user.password,
                    },
                    JWT_KEY,
                    { expiresIn: "1h" }
                );
                user.updateOne({ api_key: token });

                return res.status(200).json({
                    body: {
                        username,
                        token,
                    },
                });
            } else {
                return res.status(400).json({ message: "Incorrect Password" });
            }
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } else {
        return res.status(400).json({ message: "Every field must be filled" });
    }
});

router.get("/", async (req, res) => {
    const { user } = req.body;
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        return res.status(400).send("Authentication token is missing");
    }
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    let result = { userdata };

    return res.status(201).send({
        result,
    });
});

module.exports = router;
