const { getDb } = require("../config/db");

const DOCS_COLLECTION = "admission_documents";
const getDocsCollection = () => getDb().collection(DOCS_COLLECTION);

const saveDocument = async (data) => {
  const doc = { ...data, uploadedAt: new Date() };
  const result = await getDocsCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

const listDocuments = async (admissionId) => {
  return getDocsCollection().find({ admissionId }).sort({ uploadedAt: -1 }).toArray();
};

module.exports = {
  saveDocument,
  listDocuments,
};
