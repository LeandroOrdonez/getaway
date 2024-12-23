// backend/scripts/createAdminUser.js
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync the model with the database
    await User.sync();

    const adminUserId = uuidv4();
    const adminUsername = 'admin';
    const adminEmail = 'leandro.ordonez.ante@gmail.com';
    const adminPassword = '*************';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        id: adminUserId,
        username: adminUsername,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    if (created) {
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
      // Optionally update the existing user to ensure they have admin rights
      await user.update({ isAdmin: true });
      console.log('Existing user updated with admin rights');
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();