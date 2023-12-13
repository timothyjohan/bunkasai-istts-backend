const { default: mongoose } = require("mongoose");

const FeedbackSchema = new mongoose.Schema({    
    kritik:{
        type: String,
        required:true
    },
    saran:{
        type: String,
        required:true
    },
    pesan:{
        type: String,
        required:true
    },
    kesan:{
        type: String,
        required:true
    }
})

module.exports = mongoose.model('feedbacks', FeedbackSchema)