import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient('mongodb://localhost:27017/');
const dbName = 'sizod';
const collectionName = 'DOT-EKO';

export const connectToDb = async () => {
  await mongoClient.connect();
  console.log('Подключено к MongoDB');
  return mongoClient.db(dbName).collection(collectionName);
};
