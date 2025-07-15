import "reflect-metadata";
import app from "./app";
import { ENV } from "./config/env";
import { database } from "./config/database";
import { logger } from "./config/logger";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await database.connect();
    
    app.listen(ENV.PORT, () => {
      logger.info(`Server running on port: ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await database.disconnect();
  process.exit(0);
});

startServer();