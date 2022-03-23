const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            required: [true, 'No text of item'],
            trim: true,
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'inactive']
        },
        complete: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }],
        incomplete:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }],
        // complete: {
        //     type: [mongoose.Schema.Types.ObjectId],
        //     ref: 'Room',
        // },
        // incomplete: {
        //     type: [mongoose.Schema.Types.ObjectId],
        //     ref: 'Room',
        // },
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model('Item', itemSchema)