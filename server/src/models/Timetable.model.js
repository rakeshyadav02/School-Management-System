const { getDb } = require("../config/db");

const COLLECTION_NAME = "timetables";
const getCollection = () => getDb().collection(COLLECTION_NAME);

const createTimetable = async (data) => {
  const doc = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await getCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listTimetables = async (filter = {}, options = {}) => {
  return getCollection()
    .find(filter, options)
    .sort({ createdAt: -1 })
    .toArray();
};

const updateTimetable = async (id, update) => {
  return getCollection().updateOne(
    { _id: id },
    { $set: { ...update, updatedAt: new Date() } }
  );
};

module.exports = {
  getCollection,
  createTimetable,
  listTimetables,
  updateTimetable,
};
