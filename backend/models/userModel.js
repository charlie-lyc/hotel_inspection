const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'No name of user'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'No email of user'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'No password of user'],
            trim: true,
        },
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)