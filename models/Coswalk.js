const { default: mongoose } = require("mongoose");

const CoswalkSchema = new mongoose.Schema({

    nama_peserta:{
        type: String,
        required:true
    },
    nama_panggung:{
        type: String,
        required:true
    },
    instagram:{
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

module.exports = mongoose.model('coswalks', CoswalkSchema)