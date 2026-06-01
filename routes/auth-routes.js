const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  changePassword
} = require('../controllers/auth-controller')
const loginMiddleware = require('../middlewares/login-middleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password', loginMiddleware, changePassword)

module.exports = router
