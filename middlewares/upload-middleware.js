const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const checkFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.mp4', '.pdf']

  if (allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type'))
  }
}

module.exports = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
