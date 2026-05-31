const cloudinary = require('../config/cloudinary')

const uploadToCloudinary = async filepath => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: 'auto'
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format
    }
  } catch (e) {
    console.error('Error while uploading to cloudinary', e)
    throw new Error('Error while uploading to cloudinary')
  }
}

module.exports = { uploadToCloudinary }
