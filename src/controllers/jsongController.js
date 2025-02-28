const Jsong = require("../models/Jsong");

const createJsong = async (req, res) => {
    const { title, description, content } = req.body;

    const newJsong = {
        title: title,
        description: description,
        content: content,
    };
    try {
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
        const jsong = await Jsong.findOne({ telp: telp });
        return res.status(200).send(jsong);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const updateJsongStatus = async (req, res) => {
    const { telp } = req.params;
    try {
        const get = await Jsong.findOne({ telp: telp });
        const update = await Jsong.updateOne(
            { telp: telp },
            { status: !get.status }
        );
        return res.status(200).send(update);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const checkJsong = (req, res) => {
    res.send('GET request to the jsong');
};

module.exports = {
    createJsong,
    getAllJsongs,
    getJsongByTelp,
    updateJsongStatus,
    checkJsong,
};
