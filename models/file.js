const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true
    },
    publicId: { type: String, required: true },
    url: { type: String, required: true },

    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw'],
      required: true
    },
    format: { type: String }
  },
  { timestamps: true }
)

module.exports = mongoose.model('File', fileSchema)
