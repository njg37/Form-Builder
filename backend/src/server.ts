import sequelize from './config/database';
import app from './app';
import Form from './models/Form';

const PORT = process.env.PORT || 5000;

// Sync models with the database
sequelize
  .sync({ force: false }) // Set to true for development to recreate tables
  .then(() => {
    console.log('Database synced successfully!');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('Database sync error:', err));
