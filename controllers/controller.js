const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_KEY = "proyek2gatel";

const loginAndRegister = async (req, res) => {
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
};

module.exports = { loginAndRegister };
