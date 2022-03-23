const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    )
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Provide name, email, and password')
    }
    const foundUser = await User.findOne({ email })
    if (foundUser) {
        res.status(400)
        throw new Error('Email is already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    })
    if (!newUser) {
        res.status(500)
        throw new Error('Failed in user registration')
    }
    res.status(201).json({ message: 'User registered' })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error('Provide email and password')
    }
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
        res.status(400)
        throw new Error('Invalid email')
    }
    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) {
        res.status(400)
        throw new Error('Invalid password')
    }
    res.status(200).json({
        name: foundUser.name,
        email: foundUser.email,
        token: generateToken(foundUser.id)
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    req.headers.authorization = undefined
    req.user = undefined
    res.status(200).json({ message: 'User logged out' })
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}