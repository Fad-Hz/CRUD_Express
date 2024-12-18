const { Router } = require('express')
const { getUser, addUser, upload, displayUpdateUser, updateUser, deleteUser, displayAddUser } = require('../controllers/crud_controller')
const router = Router()

// home page
router.get('/', getUser)
// add user
router.get('/add', displayAddUser)
router.post('/add', upload, addUser)
// update user
router.get('/edit/:id', displayUpdateUser)
router.post('/edit/:id', upload, updateUser)
// delete user
router.get('/delete/:id', deleteUser)

module.exports = router