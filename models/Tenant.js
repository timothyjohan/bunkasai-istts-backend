const { default: mongoose } = require("mongoose");

const TenantSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
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