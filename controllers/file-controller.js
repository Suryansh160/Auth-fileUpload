const File = require('../models/file')
const { uploadToCloudinary } = require('../helpers/cloudinary-helper')
const cloudinary = require('../config/cloudinary')

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: true,
        message: 'Please upload a file first.'
      })
    }

    const { url, publicId, resourceType, format } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    )

    const myFile = new File({
      userId: req.userInfo._id,
      url,
      publicId,
      resourceType,
      fileName: req.file.originalname,
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

const deleteFiles = async (req, res) => {
  try {
    const userId = req.userInfo._id
    const fileId = req.params.id

    const dbQuery = await File.findById(fileId)

    if (dbQuery.userId.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are not authorized to delete this file'
      })
    }

    await cloudinary.uploader.destroy(dbQuery.publicId, {
      resource_type: dbQuery.resourceType
    })
    await File.findByIdAndDelete(fileId)

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (e) {
    console.error('Error ', e)
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    })
  }
}

module.exports = { uploadFile, getFiles, deleteFiles }
