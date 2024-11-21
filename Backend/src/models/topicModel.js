const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    description: {
        type: String,
        // maxlength: 2000
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    subjects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        required: true
    }],
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);