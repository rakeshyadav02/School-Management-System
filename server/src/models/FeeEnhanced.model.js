const { getDb } = require("../config/db");

const FEES_COLLECTION = "fees";
const PAYMENTS_COLLECTION = "fee_payments";

const getFeesCollection = () => getDb().collection(FEES_COLLECTION);
const getPaymentsCollection = () => getDb().collection(PAYMENTS_COLLECTION);

const createFeeStructure = async (data) => {
  const doc = { ...data, createdAt: new Date(), updatedAt: new Date() };
  const result = await getFeesCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listFeeStructures = async (filter = {}) => {
  return getFeesCollection().find(filter).sort({ createdAt: -1 }).toArray();
};

const recordPayment = async (data) => {
  const doc = { ...data, paidAt: new Date() };
  const result = await getPaymentsCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listPayments = async (filter = {}) => {
  return getPaymentsCollection().find(filter).sort({ paidAt: -1 }).toArray();
};

module.exports = {
  createFeeStructure,
  listFeeStructures,
  recordPayment,
  listPayments,
};
