const { getDb } = require("../config/db");

const COLLECTION_NAME = "teachers";

const getCollection = () => getDb().collection(COLLECTION_NAME);

module.exports = {
  getCollection,
  COLLECTION_NAME
};
