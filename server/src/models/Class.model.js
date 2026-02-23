const { getDb } = require("../config/db");

const COLLECTION_NAME = "classes";

const getCollection = () => getDb().collection(COLLECTION_NAME);

module.exports = {
  getCollection,
  COLLECTION_NAME
};
