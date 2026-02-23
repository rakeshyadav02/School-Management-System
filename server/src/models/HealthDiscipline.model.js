const { getDb } = require("../config/db");

const HEALTH_COLLECTION = "student_health";
const DISCIPLINE_COLLECTION = "student_discipline";

const getHealthCollection = () => getDb().collection(HEALTH_COLLECTION);
const getDisciplineCollection = () => getDb().collection(DISCIPLINE_COLLECTION);

const addHealthRecord = async (data) => {
  const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
  const result = await getHealthCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listHealthRecords = async (studentId) => {
  return getHealthCollection().find({ studentId }).sort({ createdAt: -1 }).toArray();
};

const addDisciplineRecord = async (data) => {
  const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
  const result = await getDisciplineCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listDisciplineRecords = async (studentId) => {
  return getDisciplineCollection().find({ studentId }).sort({ createdAt: -1 }).toArray();
};

module.exports = {
  addHealthRecord,
  listHealthRecords,
  addDisciplineRecord,
  listDisciplineRecords,
};
