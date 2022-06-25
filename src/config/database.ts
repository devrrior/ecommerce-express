import mongoose from 'mongoose';

const databaseConnect = async () => {
  try {
    const DB_URI = 'mongodb://127.0.0.1:27017/ecommerce';

    const database = await mongoose.connect(DB_URI);

    console.log(`Database is connected to ${database.connection.db.databaseName}`)
  } catch (err) {
    console.log(err);
    throw new Error('Error at the start of the database');
  }
};

export default databaseConnect;
