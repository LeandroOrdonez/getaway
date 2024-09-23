// backend/src/controllers/accommodationController.js
const Accommodation = require('../models/accommodation');
const { processUploadedImages, deleteImages, generateImageUrl } = require('../utils/imageUtils');

exports.createAccommodation = async (req, res) => {
  try {
    const accommodationData = req.body;
    const imagePaths = await processUploadedImages(req.files);
    accommodationData.imageUrls = imagePaths;

    const accommodation = await Accommodation.create(accommodationData);
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll();
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (accommodation) {
      res.status(200).json(accommodation);
    } else {
      res.status(404).json({ message: 'Accommodation not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    const accommodationData = req.body;
    const accommodation = await Accommodation.findByPk(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (req.files && req.files.length > 0) {
      const newImagePaths = await processUploadedImages(req.files);
      await deleteImages(accommodation.imageUrls);
      accommodationData.imageUrls = newImagePaths;
    }

    await accommodation.update(accommodationData);
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    const imagePaths = accommodation.imageUrls.map(url => url.replace(`${process.env.SERVER_URL}/uploads/`, ''));
    await deleteImages(imagePaths);
    await accommodation.destroy();
    res.status(204).send("Accommodation deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};