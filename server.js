require('dotenv').config()
const {connect} = require('mongoose')
const express = require('express')
const session = require('express-session')
const crudRouter = require('./routes/routes.js')
const { crudMiddleware } = require('./middlewares/crud_middleware.js')
const app = express()
const port = process.env.PORT 

// middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false 
}))
app.use(crudMiddleware)

// set template engines
app.set("view engine", "ejs")
app.use(express.static('uploads'))

app.use(crudRouter)

const startServer = async () => {
    try{
        app.listen(port, () => console.log(`http://localhost:${port}`))
        await connect(process.env.MONGO_URI) 
        console.log('koneksi berhasil')
    } catch(err){
        console.log(err)
    }
}
startServer()