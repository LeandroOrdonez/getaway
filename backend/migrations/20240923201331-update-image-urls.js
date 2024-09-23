// backend/src/migrations/20240923201331-update-image-urls.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [accommodations] = await queryInterface.sequelize.query(
      'SELECT id, "imageUrls" FROM "Accommodations";'
    );

    for (const accommodation of accommodations) {
      const updatedUrls = accommodation.imageUrls.map(url => {
        return url.replace(/^https?:\/\/[^\/]+/, '');
      });

      await queryInterface.sequelize.query(
        'UPDATE "Accommodations" SET "imageUrls" = :urls WHERE id = :id',
        {
          replacements: { urls: JSON.stringify(updatedUrls), id: accommodation.id },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // This migration is not reversible as we've lost the original domain information
    // You might want to implement a different down migration based on your needs
  }
};