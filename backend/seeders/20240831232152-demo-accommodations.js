'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const accommodations = [];
    const facilities = ['Wi-Fi', 'Pool', 'Gym', 'Parking', 'Restaurant', 'Bar', 'Spa', 'Beach Access', 'Room Service', 'Pet-Friendly'];
    const addresses = [
      'Contournement, 6900 Marche-en-Famenne, Luxembourg, Belgium',
      'Place De La Gare 2, 6900 Marche-en-Famenne, Luxembourg, Belgium',
      'Rue Pierreuxchamps 13, 4140 Sprimont, Liege, Belgium',
      'Rue Neuve 21, 6061 Charleroi, Hainaut, Belgium',
      'Rue De La Station 4, 6900 Marche-en-Famenne, Luxembourg, Belgium',
    ];

    for (let i = 0; i < 5; i++) {
      accommodations.push({
        name: faker.company.companyName() + ' ' + faker.lorem.word(),
        location: addresses[i],
        pricePerNight: faker.datatype.number({ min: 50, max: 500, precision: 0.01 }),
        numRooms: faker.datatype.number({ min: 1, max: 10 }),
        rating: faker.datatype.number({ min: 1, max: 5, precision: 0.1 }),
        eloScore: 1500, // Starting ELO score
        facilities: JSON.stringify(faker.random.arrayElements(facilities, faker.datatype.number({ min: 1, max: 5 }))),
        imageUrls: JSON.stringify([
          "https://g-vwmekr3y0dp.vusercontent.net/placeholder.svg?height=400&width=300",
          "https://g-vwmekr3y0dp.vusercontent.net/placeholder.svg?height=400&width=300",
          "https://g-vwmekr3y0dp.vusercontent.net/placeholder.svg?height=400&width=300"
        ]),
        originalListingUrl: faker.internet.url(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Accommodation', accommodations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Accommodation', null, {});
  }
};