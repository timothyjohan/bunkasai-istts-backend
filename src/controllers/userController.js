const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ticket = require("../models/Ticket");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Email tidak valid!" });
    }

    if (!email || !password) {
      return res.status(400).send({ message: "Semua field wajib diisi!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Password salah!" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    await user.updateOne({ api_key: token });

    return res.status(200).json({
      body: {
        name: user.name,
        phone: user.phone_number,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Terjadi kesalahan server!" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone_number } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Email tidak valid!" });
    }

    if (!email || !password || !name || !phone_number) {
      return res.status(400).send({ message: "Semua field wajib diisi!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email sudah digunakan!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone_number,
    });

    await newUser.save();

    return res.status(201).json({
      body: {
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Terjadi kesalahan server!" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { user } = req.body;
    const userdata = await User.find({});

    let result = { userdata };

    return res.status(201).send({
      result,
    });
  } catch (error) {
    return res.status(500).send({ message: "Terjadi kesalahan server!" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ message: "Bukan admin!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      body: {
      name: user.name,
      phone: user.phone_number,
      email: user.email,
      role: user.role,
      token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

const getUserDetailsWithTickets = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send({ message: "Email wajib diisi!" });
    }

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan!" });
    }

    const tickets = await Ticket.find({ email });

    return res.status(200).json({
      user,
      tickets,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Terjadi kesalahan server!" });
  }
};

module.exports = {
  loginUser,
  getAllUsers,
  registerUser,
  adminLogin,
  getUserDetailsWithTickets
};
