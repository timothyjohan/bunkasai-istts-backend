const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_KEY = "proyek2gatel";

const loginUser = async (req, res) => {
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
                return res.status(400).send({ message: "Password salah!" });
            }
        } else {
            return res.status(404).send({ message: "User Bukan Admin!" });
        }
    } else {
        return res.status(400).send({ message: "Semua field wajib diisi!" });
    }
};

const getAllUsers = async (req, res) => {
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
};

module.exports = {
    loginUser,
    getAllUsers,
};
