const express = require('express')
const { 
    registerUser, 
    loginUser, 
    logoutUser 
} = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')


const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(protect, logoutUser)

module.exports = router