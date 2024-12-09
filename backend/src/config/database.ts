import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || '',
  {
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 3600,
    },
    logging: false,
  }
);

export default sequelize;

// Error handling
try {
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
} catch (error) {
  console.error('Error initializing Sequelize:', error);
}