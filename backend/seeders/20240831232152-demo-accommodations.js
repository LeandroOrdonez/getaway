'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const accommodations = [];
    const facilities = ['Wi-Fi', 'Pool', 'Gym', 'Parking', 'Restaurant', 'Bar', 'Spa', 'Beach Access', 'Room Service', 'Pet-Friendly'];

    for (let i = 0; i < 10; i++) {
      accommodations.push({
        name: faker.company.companyName() + ' ' + faker.lorem.word(),
        location: faker.address.city() + ', ' + faker.address.country(),
        pricePerNight: faker.datatype.number({ min: 50, max: 500, precision: 0.01 }),
        numRooms: faker.datatype.number({ min: 1, max: 10 }),
        rating: faker.datatype.number({ min: 1, max: 5, precision: 0.1 }),
        eloScore: 1500, // Starting ELO score
        facilities: JSON.stringify(faker.random.arrayElements(facilities, faker.datatype.number({ min: 1, max: 5 }))),
        imageUrls: JSON.stringify([
          faker.image.imageUrl(),
          faker.image.imageUrl(),
          faker.image.imageUrl()
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