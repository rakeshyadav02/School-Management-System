const { getDb } = require("../config/db");

const COLLECTION_NAME = "admissions";
const getCollection = () => getDb().collection(COLLECTION_NAME);

const createAdmission = async (data) => {
  const doc = {
    ...data,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await getCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listAdmissions = async (filter = {}, options = {}) => {
  return getCollection()
    .find(filter, options)
    .sort({ createdAt: -1 })
    .toArray();
};

const updateAdmissionStatus = async (id, status) => {
  return getCollection().updateOne(
    { _id: id },
    { $set: { status, updatedAt: new Date() } }
  );
};

module.exports = {
  getCollection,
  createAdmission,
  listAdmissions,
  updateAdmissionStatus,
};
