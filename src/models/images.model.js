const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  originalFileName: { // Original filename
    type: String,
    required: false
  },
  size: { // Size of the file in bytes
    type: Number,
    required: false
  },
  contentType: { // MIME type of the file, e.g., 'image/jpeg'
    type: String,
    required: false
  },
  tags: [{ // Tags or categories for the image
    type: String
  }],
},{
    timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);
