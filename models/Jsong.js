const { default: mongoose } = require("mongoose");

const JsongSchema = new mongoose.Schema({

    
    nama_peserta:{
        type: String,
        required:true
    },
    telp:{
        type: String,
        required:true
    },
    nama_panggung:{
        type: String,
        required:true
    },
    lagu:{
        type: String,
        required:true
    },
    link:{
        type: String,
        required:true
    },
    img:{
        type: String,
        required:true
    },
    status:{
        type: Boolean,
        required:true
    },
})

module.exports = mongoose.model('jsongs', JsongSchema)