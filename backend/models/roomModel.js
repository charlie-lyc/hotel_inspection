const mongoose = require('mongoose')


const roomSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        number: {
            type: Number,
            required: [true, 'No room number'],
        },
        available: {
            type: Boolean,
            default: true,
        },
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model('Room', roomSchema)