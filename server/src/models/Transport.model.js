const { getDb } = require("../config/db");

const ROUTES_COLLECTION = "transport_routes";

const getRoutesCollection = () => getDb().collection(ROUTES_COLLECTION);

const addRoute = async (data) => {
  const doc = { ...data, students: [], drivers: [], createdAt: new Date(), updatedAt: new Date() };
  const result = await getRoutesCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listRoutes = async (filter = {}) => {
  return getRoutesCollection().find(filter).sort({ createdAt: -1 }).toArray();
};

const assignStudent = async (routeId, studentId) => {
  return getRoutesCollection().updateOne(
    { _id: routeId },
    { $addToSet: { students: studentId }, $set: { updatedAt: new Date() } }
  );
};

const assignDriver = async (routeId, driverId) => {
  return getRoutesCollection().updateOne(
    { _id: routeId },
    { $addToSet: { drivers: driverId }, $set: { updatedAt: new Date() } }
  );
};

module.exports = {
  addRoute,
  listRoutes,
  assignStudent,
  assignDriver,
};
