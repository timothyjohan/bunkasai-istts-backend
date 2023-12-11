const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');



//Add new tenant
router.post('/new', async (req, res) => {
  const { nama_tenant, nama_cp, telp, alamat } = req.body

  const newTenant = {
    nama_tenant: nama_tenant,
    nama_cp: nama_cp,
    telp: telp,
    alamat: alamat,
    status: false
  }
  try {
    await Tenant.create(newTenant)

  } catch (error) {
    return res.status(500).send(error)
  }

  return res.status(201).send(newTenant)
})

router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find()
    return res.status(200).send(tenants)
  } catch (error) {
    return res.status(500).send(error)
  }
})
router.put('/:id', async (req, res) => {
  const {id} = req.params
  const update = await Tenant.updateOne({na})
  res.send(id)
})


module.exports = router