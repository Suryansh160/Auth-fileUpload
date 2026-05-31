const express = require('express')
const route = express.Router()
const loginMiddleware = require('../middlewares/login-middleware')
const adminMiddleware=require('../middlewares/admin-middleware')

route.post('/welcome/admin', loginMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to admin panel'
  })
})

module.exports = route
