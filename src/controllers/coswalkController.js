const Coswalk = require("../models/Coswalk");

const createCoswalk = async (req, res) => {
    const { nama_peserta, nama_panggung, instagram } = req.body;

    try {
        const newCoswalk = {
            nama_peserta: nama_peserta,
            nama_panggung: nama_panggung,
            instagram: instagram,
            status: false,
        };

        await Coswalk.create(newCoswalk);
        return res.status(201).send(newCoswalk);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getAllCoswalks = async (req, res) => {
    try {
        const coswalk = await Coswalk.find();
        return res.status(200).send(coswalk);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getCoswalkByInstagram = async (req, res) => {
    const { instagram } = req.params;
    try {
        const coswalks = await Coswalk.findOne({ instagram: instagram });
        return res.status(200).send(coswalks);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const updateCoswalkStatus = async (req, res) => {
    const { instagram } = req.params;
    try {
        const get = await Coswalk.findOne({ instagram: instagram });
        const update = await Coswalk.updateOne(
            { instagram: instagram },
            { status: !get.status }
        );
        return res.status(200).send(update);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    createCoswalk,
    getAllCoswalks,
    getCoswalkByInstagram,
    updateCoswalkStatus
};
