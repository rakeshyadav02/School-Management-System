const { getDb } = require("../config/db");

const COLLECTION_NAME = "announcements";
const getCollection = () => getDb().collection(COLLECTION_NAME);

const createAnnouncement = async (data) => {
  const doc = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await getCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listAnnouncements = async (filter = {}, options = {}) => {
  return getCollection()
    .find(filter, options)
    .sort({ createdAt: -1 })
    .toArray();
};

module.exports = {
  getCollection,
  createAnnouncement,
  listAnnouncements,
};
