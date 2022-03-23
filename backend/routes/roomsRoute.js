const express = require('express')
const { 
    createRoom, 
    readRooms, 
    deleteRoom,
    updateRoom
} = require('../controllers/roomController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, createRoom).get(protect, readRooms)
router.route('/:id').delete(protect, deleteRoom).patch(protect, updateRoom)

module.exports = router