const express = require('express')
const loginMiddleware = require('../middlewares/login-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')
const multerMiddleware = require('../middlewares/upload-middleware')
const {
  uploadFile,
  getFiles,
  deleteFiles
} = require('../controllers/file-controller')

const route = express.Router()

route.post(
  '/upload',
  loginMiddleware,
  adminMiddleware,
  multerMiddleware.single('file'),
  uploadFile
)

route.get('/get', loginMiddleware, getFiles)
route.delete('/:id', loginMiddleware, deleteFiles)

module.exports = route
