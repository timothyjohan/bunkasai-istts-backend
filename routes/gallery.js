const express = require('express');
const router = express.Router();
const multer = require('multer');
const { default: axios } = require('axios');
const dotenv = require('dotenv').config().parsed;
const fs = require('fs');
const Gallery = require('../models/Gallery');



const storage = multer.diskStorage({})

const upload = multer({storage})

//Add new Photo contestant
router.post('/new', upload.single('photo'), async (req, res) => {
  const photo = fs.readFileSync(req.file.path, { encoding: 'base64' });
  
  try {
    const imgurResponse = await axios.post(
      `https://api.imgur.com/3/image?client_id=${process.env.IMGUR_CLIENT_ID}`,
      {
        image: photo,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        },
        
      }
      )
      let tempImg = imgurResponse.data.data.link
      
      const newphoto = {
        img:tempImg
      }

    await Gallery.create(newphoto)
    
    return res.status(201).send(newphoto)
  } catch (error) {
    return res.status(500).send(error.message)
  }

})

router.get('/', async (req, res) => {
  const request = await Gallery.find()
  return res.status(200).send(request)
})
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const url = `https://i.imgur.com/${id}.png`

  try {
    await Gallery.deleteOne({img:url})
    await axios.delete(`https://api.imgur.com/3/image/${id}?client_id=${process.env.IMGUR_CLIENT_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
      },
      
    }
    )
    return res.status(201).send(`Image berhasil dihapus`)

  } catch (error) {
    return res.status(500).send(error)
    
  }
})


module.exports = router