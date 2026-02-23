const { getDb } = require("../config/db");

const COLLECTION_NAME = "notifications";
const getCollection = () => getDb().collection(COLLECTION_NAME);

const createNotification = async (data) => {
  const doc = {
    ...data,
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await getCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listNotifications = async (userId, filter = {}) => {
  return getCollection()
    .find({ userId, ...filter })
    .sort({ createdAt: -1 })
    .toArray();
};

const markAsRead = async (notificationId) => {
  return getCollection().updateOne(
    { _id: notificationId },
    { $set: { read: true, updatedAt: new Date() } }
  );
};

module.exports = {
  getCollection,
  createNotification,
  listNotifications,
  markAsRead,
};
