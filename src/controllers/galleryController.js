const Gallery = require("../models/Gallery");
const axios = require("axios");
const dotenv = require("dotenv").config().parsed;

const createGallery = async (req, res) => {
    const { title, description, imageUrl } = req.body;

    const newGallery = {
        title: title,
        description: description,
        imageUrl: imageUrl,
    };
    try {
        await Gallery.create(newGallery);
        return res.status(201).send(newGallery);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getAllGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find();
        return res.status(200).send(galleries);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const deleteGallery = async (req, res) => {
    const { id } = req.params;
    const url = `https://i.imgur.com/${id}.png`;

    try {
        await Gallery.deleteOne({ img: url });
        await axios.delete(
            `https://api.imgur.com/3/image/${id}?client_id=${process.env.IMGUR_CLIENT_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
                },
            }
        );
        return res.status(201).send(`Image berhasil dihapus`);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    createGallery,
    getAllGalleries,
    deleteGallery,
};
