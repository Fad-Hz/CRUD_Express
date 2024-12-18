const User = require('../models/User.js')
const multer = require('multer')
const fs = require('fs')

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
})

exports.upload = multer({ storage }).single('image')

exports.getUser = async (req, res) => {
    try {
        const users = await User.find().exec()
        res.render('home.ejs', { title: "Home Page", users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.displayAddUser = (req, res) => {
    res.render('add_user.ejs', { title: "Add User" })
}

exports.addUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body
        const user = new User({
            name,
            email,
            phone,
            image: req.file?.filename || null // Optional chaining for file handling
        })

        await user.save()

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        }
        res.redirect('/')
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.displayUpdateUser = async (req, res) => {
    try {
        let id = req.params.id
        const findUserId = await User.findById(id)
        if (findUserId) {
            res.render('edit_user.ejs', { title: 'Edit Page', user: findUserId })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        let id = req.params.id
        let newImage = ''

        if (req.file) {
            newImage = req.file.filename
            if (req.body.old_image) {
                fs.unlinkSync(`./uploads/${req.body.old_image}`)
            }
        } else {
            newImage = req.body.old_image
        }

        const { name, email, phone } = req.body

        const updateUserById = await User.findByIdAndUpdate(
            id,
            { name, email, phone, image: newImage },
            { new: true }
        )

        if (updateUserById) {
            req.session.message = { type: 'success', message: 'User updated successfully!' }
        } else {
            req.session.message = { type: 'danger', message: 'User not found!' }
        }

        res.redirect('/')
    } catch (err) {
        req.session.message = { type: 'danger', message: 'An error occurred while updating the user' }
        res.status(400).json({ message: err.message })
    }
}


exports.deleteUser = async (req, res) => {
    try {
        let id = req.params.id
        const deleteUserById = await User.findByIdAndDelete(id)
        if (deleteUserById) {
            fs.unlinkSync(`./uploads/${deleteUserById.image}`)
            req.session.message = { type: 'success', message: 'User deleted successfully!' }
        } 
        res.redirect('/')
    } catch (err) {
        req.session.message = { type: 'danger', message: 'An error occurred while deleting the user' }
        res.status(400).json({ message: err.message })
    }
}
