const asyncHandler = require('express-async-handler')
const Room = require('../models/roomModel')
const Item = require('../models/itemModel')


const createRoom = asyncHandler(async (req, res) => {
    if (!req.body.number) {
        res.status(400)
        throw new Error('Provide room number')
    }
    const foundRoom = await Room.findOne({
        user: req.user.id, 
        number: req.body.number 
    })
    if (foundRoom) {
        res.status(400)
        throw new Error('Room number already exists')
    }
    const newRoom = await Room.create({ 
        user: req.user.id, 
        number: req.body.number 
    })
    if (!newRoom) {
        res.status(500)
        throw new Error('Failed in room creation')
    }
    res.status(201).json({ 
        id: newRoom.id,
        number: newRoom.number,
        available: newRoom.available
    })
})

const readRooms = asyncHandler(async (req, res) => {
    const allRooms = await Room.find({ user: req.user.id })
    if (!allRooms) {
        res.status(500)
        throw new Error('Failed in finding rooms')
    }
    const allRoomsWithoutUser = allRooms.map(room => ({
        id: room.id,
        number: room.number,
        available: room.available
    }))
    res.status(200).json(allRoomsWithoutUser)
})

const deleteRoom = asyncHandler(async (req, res) => {
    const foundRoom = await Room.findById(req.params.id)
    if (!foundRoom) {
        res.status(400)
        throw new Error(`Not found room id ${req.params.id}`)
    }
    if (foundRoom.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized user')
    }
    const deletedRoom = await Room.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    })
    if (!deletedRoom) {
        res.status(500)
        throw new Error('Failed in deleting room')
    }
    res.status(200).json({ id: deletedRoom.id })
})

const updateRoom = asyncHandler(async (req, res) => {
    if (!req.body.available) {
        res.status(400)
        throw new Error('Provide room availability')
    }
    const foundRoom = await Room.findById(req.params.id)
    if (!foundRoom) {
        res.status(400)
        throw new Error(`Not found room id ${req.params.id}`)
    }
    if (foundRoom.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized user')
    }
    const updatedRoom = await Room.findOneAndUpdate({
            _id: req.params.id,
            user: req.user.id
        },
        req.body,
        { 
            new: true,
            runValidators: true 
    })

    if (!updatedRoom) {
        res.status(500)
        throw new Error('Failed in updating room')
    }
    res.status(200).json({
        id: updatedRoom.id,
        number: updatedRoom.number,
        available: updatedRoom.available
    })
}) 

module.exports = {
    createRoom,
    readRooms,
    deleteRoom,
    updateRoom
}