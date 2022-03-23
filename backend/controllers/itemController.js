const asyncHandler = require('express-async-handler')
const Room = require('../models/roomModel')
const Item = require('../models/itemModel')


const createItem = asyncHandler(async (req, res) => {
    const allRooms = await Room.find({ user: req.user.id })
    if (!allRooms) {
        res.status(500)
        throw new Error('Failed in getting rooms')
    }
    if (allRooms.length === 0) {
        res.status(400)
        throw new Error('Firstly, register rooms as many as you have!')
    }
    const roomIds = allRooms.filter(room => room.id)
    if (!req.body.text) {
        res.status(400)
        throw new Error('Provide item text')
    }
    const newItem = await Item.create({
        user: req.user.id,
        text: req.body.text,
        complete: [],
        incomplete: [ ...roomIds ]
    })
    if (!newItem) {
        res.status(500)
        throw new Error('Failed in item creation')
    }
    res.status(201).json({ 
        id: newItem.id,
        text: newItem.text,
        status: newItem.status,
        complete: newItem.complete.map(room => ({
            id: room.id,
            number: room.number,
            available: room.available
        })),
        incomplete: newItem.incomplete.map(room => ({
            id: room.id,
            number: room.number,
            available: room.available
        }))
    })
})

const readItems = asyncHandler(async (req, res) => {
    const allItems = await Item.find({ user: req.user.id })
        .populate(['complete', 'incomplete'])
    if (!allItems) {
        res.status(500)
        throw new Error('Failed in getting items')
    }
    const allItemsWithoutUser = allItems.map(item => ({
        id: item.id,
        text: item.text,
        status: item.status,
        complete: item.complete.map(room => ({
            id: room.id,
            number: room.number,
            available: room.available
        })),
        incomplete: item.incomplete.map(room => ({
            id: room.id,
            number: room.number,
            available: room.available
        }))
    }))
    res.status(200).json(allItemsWithoutUser)
})

const removeItem = asyncHandler(async (req, res) => {
    const foundItem = await Item.findById(req.params.id)
    if (!foundItem) {
        res.status(400)
        throw new Error(`Not found item id ${req.params.id}`)
    }
    if (foundItem.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized user')
    }
    const deletedItem = await Item.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    })
    if (!deletedItem) {
        res.status(500)
        throw new Error('Failed in deleting item')
    }
    res.status(200).json({ id: deletedItem.id })
})

const updateItemByRoom = asyncHandler(async (req, res) => {
    // console.log(req.params.id)
    // console.log(req.params.action)
    // console.log(req.params.roomId)
    const foundItem = await Item.findById(req.params.id)
    if (!foundItem) {
        res.status(400)
        throw new Error(`Not found item id ${req.params.id}`)
    }
    if (foundItem.status === 'inactive') {
        res.status(400)
        throw new Error('Not active item')
    }
    const foundRoom = await Room.findById(req.params.roomId)
    if (!foundRoom) {
        res.status(400)
        throw new Error(`Not found room id ${req.params.roomId}`)
    }
    if (!foundRoom.available) {
        res.status(400)
        throw new Error(`Not available room id ${req.params.roomId}`)
    }
    if (foundItem.user.toString() !== foundRoom.user.toString() || foundRoom.user.toString() !== req.user.id || foundItem.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized user')
    }
    if (req.params.action !== 'complete' && req.params.action !== 'incomplete') {
        res.status(400)
        throw new Error(`Not allowed action '${req.params.action}'`)
    }
    let exist
    let updatedItem
    if (req.params.action === 'incomplete') {
        exist = foundItem.incomplete.some(room => {
            // console.log(room.id)      // Buffer
            // console.log(room._id)     // ObjectId
            // console.log(foundRoom.id) // String
            // console.log(foundRoom._id)// ObjectId
            return room._id.toString() === foundRoom.id
        })
        if (exist) {
            res.status(400)
            throw new Error('Already incomplete room')
        }
        updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                complete: foundItem.complete.filter(room => room._id.toString() !== foundRoom.id),
                incomplete: [ ...foundItem.incomplete, foundRoom.id ]
            },
            {
                new: true,
                runValidators: true
            }
        )
    } else if (req.params.action === 'complete') {
        exist = foundItem.complete.some(room => room._id.toString() === foundRoom.id)
        if (exist) {
            res.status(400)
            throw new Error('Already complete room')
        }
        updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                complete: [ ...foundItem.complete, foundRoom.id ],
                incomplete: foundItem.incomplete.filter(room => room._id.toString() !== foundRoom.id)
            },
            {
                new: true,
                runValidators: true
            }
        )
    }
    res.status(200).json({
        id: updatedItem.id,
        text: updatedItem.text,
        status: updatedItem.status,
        complete: updatedItem.complete,
        incomplete: updatedItem.incomplete
    })
})

module.exports = {
    createItem,
    readItems,
    removeItem,
    updateItemByRoom
}