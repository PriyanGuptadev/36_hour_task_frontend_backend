import { MongoClient, Db } from "mongodb";
import { ENV } from "./env";
import { logger } from "./logger";

class Database {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(ENV.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(ENV.MONGODB_DB_NAME);
      logger.info("Connected to MongoDB successfully");
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      logger.info("Disconnected from MongoDB");
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw new Error("Database client not connected. Call connect() first.");
    }
    return this.client;
  }
}

export const database = new Database(); 