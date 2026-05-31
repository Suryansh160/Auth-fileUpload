const File = require('../models/file')
const { uploadToCloudinary } = require('../helpers/cloudinary-helper')
const fs = require('fs')

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: true,
        message: 'Please upload a file first.'
      })
    }

    const { url, publicId, resourceType, format } = await uploadToCloudinary(
      req.file.path
    )

    fs.unlinkSync(req.file.path)

    const myFile = new File({
      userId: req.userInfo._id,
      url,
      publicId,
      resourceType,
      format
    })

    await myFile.save()

    res.status(201).json({
      success: true,
      message: 'file uploaded successfully',
      file: myFile
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    })
  }
}

const getFiles = async (req, res) => {
try {
    const userId = req.userInfo._id

    const files = await File.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: files.length,
      message: 'Files retrieved successfully',
      files
    })
  } catch (e) {
    console.error('Error fetching files:', e)
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching files'
    })
  }
}

module.exports = { uploadFile, getFiles }
