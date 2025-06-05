const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const mongoURI = `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PWD}@backbomberos.ub0bc.mongodb.net/?retryWrites=true&w=majority&appName=backBomberos`;

    await mongoose.connect(mongoURI, {
      dbName: process.env.MONGO_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('MongoDB connected');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
