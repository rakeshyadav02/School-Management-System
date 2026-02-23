const { MongoClient, ServerApiVersion } = require("mongodb");
const { env } = require("./env");

let db = null;
let client = null;

const connectDb = async () => {
  console.log("Connecting to MongoDB...");
  
  client = new MongoClient(env.mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();
  await client.db("admin").command({ ping: 1 });
  
  db = client.db("school_management_system");
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
  return db;
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDb first.");
  }
  return db;
};

const closeDb = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

module.exports = { connectDb, getDb, closeDb };
