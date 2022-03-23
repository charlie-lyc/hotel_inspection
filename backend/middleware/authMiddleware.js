const asyncHandler = require('express-async-handler')
const req = require('express/lib/request')
const res = require('express/lib/response')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const protect = asyncHandler(async (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
        res.status(401)
        throw new Error('No token')
    }
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const foundUser = await User.findById(decoded.id).select('-password')
    if (!foundUser) {
        res.status(401)
        throw new Error('Invalid token')
    }
    req.user = foundUser
    next()
})

module.exports = protect