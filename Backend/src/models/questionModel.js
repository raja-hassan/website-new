const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    opID: {
        type: Number,
        required: true
    },
    opText: {
        type: String,
        required: true,
        
    },
    correct: {
        type: Boolean,
        required: true
    }
});

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    options: {
        type: [optionSchema],
        required: [true],
    },
    level: {
        type: String,
        required: [true, "Level is required"],
        enum:[0, 1, 2]
    },
    subjects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        required: true
    }],
    topics:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Topic',
        required: true
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    // createdBy:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'User',
    //     required: true
    // }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);