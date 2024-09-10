//backend/src/controllers/adminController.js
const Accommodation = require('../models/accommodation');

exports.createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body);
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

exports.updateAccommodation = async (req, res) => {
  try {
    const [updated] = await Accommodation.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAccommodation = await Accommodation.findByPk(req.params.id);
      res.status(200).json(updatedAccommodation);
    } else {
      res.status(404).json({ message: 'Accommodation not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const deleted = await Accommodation.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send("Accommodation deleted");
    } else {
      res.status(404).json({ message: 'Accommodation not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};