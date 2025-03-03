const Tenant = require("../models/Tenant");

const createTenant = async (req, res) => {
    const { nama_tenant, nama_cp, telp, alamat } = req.body;

    const newTenant = {
        nama_tenant: nama_tenant,
        nama_cp: nama_cp,
        telp: telp,
        alamat: alamat,
        status: false,
    };
    try {
        await Tenant.create(newTenant);
    } catch (error) {
        return res.status(500).send(error);
    }

    return res.status(201).send(newTenant);
};

const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find();
        return res.status(200).send(tenants);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const updateTenantStatus = async (req, res) => {
    const { tel } = req.params;
    const get = await Tenant.findOne({ telp: tel });

    const update = await Tenant.updateOne(
        { telp: tel },
        { status: !get.status }
    );
    res.send(update);
};

module.exports = {
    createTenant,
    getAllTenants,
    updateTenantStatus,
};
