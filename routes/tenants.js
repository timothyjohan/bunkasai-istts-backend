const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');

router.get('/', (req, res) => {
  res.send('GET req')
})


//Add new tenant
router.post('/new', async (req, res) => {
  const {nama_tenant, nama_cp, telp, alamat} = req.body

  const newTenant = {
    nama_tenant:nama_tenant,
    nama_cp: nama_cp,
    telp:telp,
    alamat:alamat,
    status:false
  }
  try {
    await Tenant.create(newTenant)
    
  } catch (error) {
    return res.status(500).send(error)
  }

  return res.status(201).send(newTenant)
})


module.exports = router