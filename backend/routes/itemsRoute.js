const express = require('express')
const { 
    createItem, 
    readItems, 
    removeItem,
    updateItemByRoom
} = require('../controllers/itemController')
const protect = require('../middleware/authMiddleware')


const router = express.Router()

router.route('/').post(protect, createItem).get(protect, readItems)
router.route('/:id').delete(protect, removeItem)
router.route('/:id/:action/:roomId').patch(protect, updateItemByRoom)

module.exports = router