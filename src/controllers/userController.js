const User = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Regex untuk memvalidasi format email
  // Penjelasan:
  // ^ : Menandakan awal dari string.
  // [^\s@]+ : Mencocokkan satu atau lebih karakter yang bukan spasi (\s) atau tanda @.
  // @ : Karakter @ harus ada di posisi ini.
  // [^\s@]+ : Mencocokkan satu atau lebih karakter yang bukan spasi atau tanda @ setelah karakter @.
  // \. : Karakter titik (.) harus ada di posisi ini.
  // [^\s@]+ : Mencocokkan satu atau lebih karakter yang bukan spasi atau tanda @ setelah karakter titik.
  // $ : Menandakan akhir dari string.
  // Regex ini memastikan bahwa alamat email memiliki format yang benar, yaitu bagian sebelum @, diikuti oleh @, diikuti oleh bagian setelah @, dan diakhiri dengan domain yang valid.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Email tidak valid!" });
  }

  if (email && password) {
    const user = await User.findOne({ email });
    if (user) {
      if (user.password === password) {
        const name = user.name;
        const phone = user.phone_number;

        const token = jwt.sign(
          {
            email: user.email,
            password: user.password,
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        user.updateOne({ api_key: token });

        return res.status(200).json({
          body: {
            name,
            phone,
            email,
            token,
          },
        });
      } else {
        return res.status(400).send({ message: "Password salah!" });
      }
    } else {
      return res.status(404).send({ message: "User tidak ditemukan!" });
    }
  } else {
    return res.status(400).send({ message: "Semua field wajib diisi!" });
  }
};

const registerUser = async (req, res) => {
    const { email, password, name, phone_number } = req.body;

  // Regex untuk memvalidasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Email tidak valid!" });
  }

  if (email && password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email sudah digunakan!" });
    }

    if (email && password && name && phone_number) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email sudah digunakan!" });
        }

        const newUser = new User({ email, password, name, phone_number });
        console.log(newUser);
        
        await newUser.save();

    return res.status(201).json({
      body: {
        email: newUser.email,
      },
    });
  } else {
    return res.status(400).send({ message: "Semua field wajib diisi!" });
  }
}};

const getAllUsers = async (req, res) => {
  const { user } = req.body;
  const userdata = await User.find({});

  let result = { userdata };

  return res.status(201).send({
    result,
  });
};

module.exports = {
  loginUser,
  getAllUsers,
  registerUser,
};
