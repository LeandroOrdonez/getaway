const Accommodation = require('../models/accommodation');
const Comparison = require('../models/comparison');
const sequelize = require('../config/database');

const K_FACTOR = 32;

function calculateEloRating(winnerRating, loserRating) {
  // Ensure the ratings are numeric
  winnerRating = Number(winnerRating);
  loserRating = Number(loserRating);

  // Check if conversion was successful
  if (isNaN(winnerRating) || isNaN(loserRating)) {
    throw new Error('Invalid rating: must be a numeric value.');
  }
  const expectedScore = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const newWinnerRating = winnerRating + K_FACTOR * (1 - expectedScore);
  const newLoserRating = loserRating + K_FACTOR * (0 - (1 - expectedScore));
  return [newWinnerRating, newLoserRating];
}

exports.getRandomPair = async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll({
      order: sequelize.random(),
      limit: 2,
    });
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitComparison = async (req, res) => {
  const { winnerAccommodationId, loserAccommodationId } = req.body;
  const userId = req.user.id;
  const userType = req.userType;
  
  const transaction = await sequelize.transaction();

  try {
    const winner = await Accommodation.findByPk(winnerAccommodationId, { transaction });
    const loser = await Accommodation.findByPk(loserAccommodationId, { transaction });

    if (!winner || !loser) {
      await transaction.rollback();
      return res.status(404).json({ message: 'One or both accommodations not found' });
    }

    console.log(`Winner: ${JSON.stringify(winner)}`);
    console.log(`Loser: ${JSON.stringify(loser)}`);
    
    const [newWinnerRating, newLoserRating] = calculateEloRating(winner.eloScore, loser.eloScore);

    console.log(`New winner rating: ${newWinnerRating}`);
    console.log(`New loser rating: ${newLoserRating}`);


    await winner.update({ eloScore: newWinnerRating }, { transaction });
    await loser.update({ eloScore: newLoserRating }, { transaction });

    await Comparison.create({
      userId,
      userType,
      winnerAccommodationId,
      loserAccommodationId,
    }, { transaction });

    await transaction.commit();

    res.status(201).json({ message: 'Comparison submitted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getRankings = async (req, res) => {
  try {
    const rankings = await Accommodation.findAll({
      order: [['eloScore', 'DESC']],
      attributes: ['id', 'name', 'rating', 'eloScore'],
    });
    res.status(200).json(rankings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};