import mongoose from 'mongoose';

import logger from '../api/v1/utils/logger';

const databaseConnect = async () => {
  try {
    const DB_URI = process.env.DB_URI || '123';

    const database = await mongoose.connect(DB_URI);

    logger.info(
      `Database is connected to ${database.connection.db.databaseName}`
    );
  } catch (err) {
    logger.error(err);
    throw new Error('Error at the start of the database');
  }
};

export default databaseConnect;
