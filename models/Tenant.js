const { default: mongoose } = require("mongoose");

const TenantSchema = new mongoose.Schema({
    id:{
        type: Number,
        required:true
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
        type: Array,
        required:true
    },
    status:{
        type: Boolean,
        required:true
    },
})

module.exports = mongoose.model('tenants', TenantSchema)