/////////////////////////////////////////////////////////
// const RoomData= require('./config/RoomData')
// console.log(RoomData.length)
/////////////////////////////////////////////////////////
const express = require('express')
require('dotenv').config()
require('colors')
const connectDB = require('./config/db')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')


connectDB()
require('./config/passport')(passport)

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }, // For HTTPS
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//////////////////////////////////////////////////////////////////

app.use('/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/usersRoute'))
app.use('/api/items', require('./routes/itemsRoute'))
app.use('/api/rooms', require('./routes/roomsRoute'))

//////////////////////////////////////////////////////////////////

app.use(require('./middleware/errorHandler'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV.toUpperCase()} mode on port ${PORT}`.blue.underline)
)