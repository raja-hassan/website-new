const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    }
});

module.exports = mongoose.model('Subject', subjectSchema);