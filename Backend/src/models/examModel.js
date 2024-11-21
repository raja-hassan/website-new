const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        required: true
    },
    topics:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Topic',
        require:false
    }],
    level: {
        type: Number
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Question',
        userAnswer:Number,
        correctAnswer:Number
    }],
    totalScore:{
        type:Number
    },
    obtainedScore:{
        type:Number
    },
    isCompleted:{
        type:Boolean,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);