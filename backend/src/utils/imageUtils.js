// backend/src/utils/imageUtils.js
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const uploadDir = process.env.UPLOAD_DIRECTORY || 'uploads';

const processUploadedImages = async (files) => {
  const imagePaths = [];

  for (const file of files) {
    const resizedImageBuffer = await sharp(file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const resizedImagePath = path.join(uploadDir, `resized-${file.filename}`);
    await fs.writeFile(resizedImagePath, resizedImageBuffer);

    // Delete the original file
    await fs.unlink(file.path);

    imagePaths.push(`/uploads/${path.basename(resizedImagePath)}`);
  }

  return imagePaths;
};

const deleteImages = async (imagePaths) => {
  for (const imagePath of imagePaths) {
    try {
      await fs.unlink(path.join(process.cwd(), imagePath));
    } catch (error) {
      console.error(`Failed to delete image: ${imagePath}`, error);
    }
  }
};

module.exports = {
  processUploadedImages,
  deleteImages,
};