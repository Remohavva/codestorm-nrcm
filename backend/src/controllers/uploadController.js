const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Simple base64 image upload (for development)
// In production, use proper cloud storage like AWS S3, Cloudinary, etc.
const uploadImage = async (req, res, next) => {
  try {
    const { image_data, filename } = req.body;

    if (!image_data) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required'
      });
    }

    // Validate base64 image data
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (!base64Regex.test(image_data)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Only JPEG, PNG, GIF, and WebP are supported.'
      });
    }

    // Extract image type and data
    const matches = image_data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 image data'
      });
    }

    const imageType = matches[1];
    const base64Data = matches[2];

    // Generate unique filename
    const uniqueId = crypto.randomUUID();
    const imageFilename = `${uniqueId}.${imageType}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Save image file
    const imagePath = path.join(uploadsDir, imageFilename);
    await fs.writeFile(imagePath, base64Data, 'base64');

    // Return image URL (in production, this would be a CDN URL)
    const imageUrl = `/uploads/${imageFilename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        image_url: imageUrl,
        filename: imageFilename,
        size: Buffer.byteLength(base64Data, 'base64')
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

module.exports = {
  uploadImage
};