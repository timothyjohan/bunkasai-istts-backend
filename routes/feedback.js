const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

router.post('/new', async (req, res) => {
  const { kritik, saran, pesan, kesan } = req.body
  const newFeedback = {
    kritik: kritik,
    saran: saran,
    pesan: pesan,
    kesan: kesan,
  }
  try {
    await Feedback.create(newFeedback)
  } catch (error) {
    return res.status(500).send(error)
  }

  return res.status(201).send(newFeedback)
})

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
    return res.status(200).send(feedbacks)
  } catch (error) {
    return res.status(500).send(error)
  }
})

module.exports = router