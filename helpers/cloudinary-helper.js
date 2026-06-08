const cloudinary = require('../config/cloudinary')
const path = require('path')

const uploadToCloudinary = async (fileBuffer, originalName) => {
  try {
    // Determine resource type based on file extension
    const ext = path.extname(originalName).toLowerCase()
    let resourceType = 'auto'

    if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
      resourceType = 'video'
    } else if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
      resourceType = 'raw'
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      resourceType = 'image'
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType
        },
        (error, result) => {
          if (error) reject(error)
          else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              resourceType: result.resource_type,
              format: result.format
            })
          }
        }
      )
      uploadStream.end(fileBuffer)
    })
  } catch (e) {
    console.error('Error while uploading to cloudinary', e)
    throw new Error('Error while uploading to cloudinary')
  }
}

module.exports = { uploadToCloudinary }
