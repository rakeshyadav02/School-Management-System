const app = require("./src/app");
const { connectDb, closeDb } = require("./src/config/db");
const { env } = require("./src/config/env");

const startServer = async () => {
  await connectDb();

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
