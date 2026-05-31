const express = require('express')
const route = express.Router()
const loginMiddleware = require('../middlewares/login-middleware')

route.post('/welcome', loginMiddleware,(req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to common panel'
  })
})

module.exports = route
