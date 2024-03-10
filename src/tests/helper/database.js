const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoDb;

const connect = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();
  // mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
};

const cleanData = async () => {
  await mongoose.connection.db.dropDatabase();
};

const disconnect = async () => {
  await mongoose.disconnect();
  await mongoDb.stop();
};

// Export the functions for use elsewhere in your project
module.exports = {
  connect,
  cleanData,
  disconnect,
};
