const Feedback = require("../models/Feedback");

const createFeedback = async (req, res) => {
    const { nama, email, pesan } = req.body;

    const newFeedback = {
        nama: nama,
        email: email,
        pesan: pesan,
    };
    try {
        await Feedback.create(newFeedback);
        return res.status(201).send(newFeedback);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        return res.status(200).send(feedbacks);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    createFeedback,
    getAllFeedbacks,
};
