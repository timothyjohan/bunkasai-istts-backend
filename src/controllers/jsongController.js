const Jsong = require("../models/Jsong");

const createJsong = async (req, res) => {
    const { nama_peserta, telp, nama_panggung, lagu, link } = req.body;
    try {
        // const imgurResponse = await axios.post(
        //     `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
        //     {
        //         image: bukti,
        //     },
        //     {
        //         headers: {
        //             Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        //         },
        //     }
        // );
        const newJsong = {
            nama_peserta: nama_peserta,
            telp: telp,
            nama_panggung: nama_panggung,
            lagu: lagu,
            link: link,
            email: req.user.email, // Assuming req.user is set by authenticateToken middleware
            status: false,
        };
        await Jsong.create(newJsong);
        return res.status(201).send(newJsong);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getAllJsongs = async (req, res) => {
    try {
        const jsongs = await Jsong.find();
        return res.status(200).send(jsongs);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getJsongByTelp = async (req, res) => {
    const { telp } = req.params;
    try {
        const jsongs = await Jsong.findOne({ telp: telp });
        return res.status(200).send(jsongs);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const updateJsongStatus = async (req, res) => {
    const { telp } = req.params;
    const get = await Jsong.findOne({ telp: telp });
    const update = await Jsong.updateOne(
        { telp: telp },
        { status: !get.status }
    );
    res.send(update);
};

const getJsongByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const jsongs = await Jsong.find({ email: email });
        return res.status(200).send(jsongs);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    createJsong,
    getAllJsongs,
    getJsongByTelp,
    updateJsongStatus,
    getJsongByEmail,
};
