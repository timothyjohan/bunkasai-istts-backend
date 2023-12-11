const { default: mongoose } = require("mongoose");

const TenantSchema = new mongoose.Schema({

    nama_tenant:{
        type: String,
        required:true
    },
    nama_cp:{
        type: String,
        required:true
    },
    telp:{
        type: String,
        required:true
    },
    alamat:{
        type: String,
        required:true
    },
    status:{
        type: Boolean,
        required:true
    },
})

module.exports = mongoose.model('tenants', TenantSchema)