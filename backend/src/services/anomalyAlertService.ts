import { Collection, ObjectId } from "mongodb";
import { database } from "../config/database";
import { 
  AnomalyAlert, 
  CreateAnomalyAlertRequest, 
  UpdateAnomalyAlertRequest, 
  AlertFilters 
} from "../types/anomalyAlert";
import { logger } from "../config/logger";

export class AnomalyAlertService {
  private get collection(): Collection<AnomalyAlert> {
    return database.getDb().collection<AnomalyAlert>("anomaly_alerts");
  }

  async createAlert(alertData: CreateAnomalyAlertRequest): Promise<AnomalyAlert> {
    try {
      const newAlert: Omit<AnomalyAlert, '_id'> = {
        detectionTime: new Date(),
        alertType: alertData.alertType,
        audioFilePath: alertData.audioFilePath,
        waveformData: [], // Will be populated by audio processing
        spectrogramData: [], // Will be populated by audio processing
        suspectedReason: alertData.suspectedReason,
        action: alertData.action || "",
        comment: alertData.comment || ""
      };

      const result = await this.collection.insertOne(newAlert);
      const createdAlert = await this.collection.findOne({ _id: result.insertedId });
      
      if (!createdAlert) {
        throw new Error("Failed to create alert");
      }

      logger.info(`Created new alert with ID: ${result.insertedId}`);
      return createdAlert;
    } catch (error) {
      logger.error("Error creating alert:", error);
      throw error;
    }
  }

  async getAlerts(filters: AlertFilters = {}, page: number = 1, limit: number = 10): Promise<{ alerts: AnomalyAlert[], total: number }> {
    try {
      const query: any = {};

      // Apply date filters
      if (filters.startDate || filters.endDate) {
        query.detectionTime = {};
        if (filters.startDate) {
          query.detectionTime.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.detectionTime.$lte = new Date(filters.endDate);
        }
      }

      // Apply alert type filter
      if (filters.alertType) {
        query.alertType = filters.alertType;
      }

      const skip = (page - 1) * limit;
      
      const [alerts, total] = await Promise.all([
        this.collection
          .find(query)
          .sort({ detectionTime: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        this.collection.countDocuments(query)
      ]);

      logger.info(`Retrieved ${alerts.length} alerts out of ${total} total`);
      return { alerts, total };
    } catch (error) {
      logger.error("Error retrieving alerts:", error);
      throw error;
    }
  }

  async getAlertById(id: string): Promise<AnomalyAlert | null> {
    try {
      const objectId = new ObjectId(id);
      const alert = await this.collection.findOne({ _id: objectId });
      
      if (alert) {
        logger.info(`Retrieved alert with ID: ${id}`);
      } else {
        logger.warn(`Alert with ID ${id} not found`);
      }
      
      return alert;
    } catch (error) {
      logger.error(`Error retrieving alert with ID ${id}:`, error);
      throw error;
    }
  }

  async updateAlert(id: string, updateData: UpdateAnomalyAlertRequest): Promise<AnomalyAlert | null> {
    try {
      const objectId = new ObjectId(id);
      const updateFields: any = {};

      if (updateData.action !== undefined) {
        updateFields.action = updateData.action;
      }
      if (updateData.comment !== undefined) {
        updateFields.comment = updateData.comment;
      }
      if (updateData.suspectedReason !== undefined) {
        updateFields.suspectedReason = updateData.suspectedReason;
      }

      const result = await this.collection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

      if (result) {
        logger.info(`Updated alert with ID: ${id}`);
        return result;
      } else {
        logger.warn(`Alert with ID ${id} not found for update`);
        return null;
      }
    } catch (error) {
      logger.error(`Error updating alert with ID ${id}:`, error);
      throw error;
    }
  }

  async updateAudioData(id: string, waveformData: number[], spectrogramData: number[][]): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      const result = await this.collection.updateOne(
        { _id: objectId },
        { 
          $set: { 
            waveformData, 
            spectrogramData 
          } 
        }
      );

      if (result.matchedCount === 0) {
        throw new Error(`Alert with ID ${id} not found`);
      }

      logger.info(`Updated audio data for alert with ID: ${id}`);
    } catch (error) {
      logger.error(`Error updating audio data for alert with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteAlert(id: string): Promise<boolean> {
    try {
      const objectId = new ObjectId(id);
      const result = await this.collection.deleteOne({ _id: objectId });

      if (result.deletedCount > 0) {
        logger.info(`Deleted alert with ID: ${id}`);
        return true;
      } else {
        logger.warn(`Alert with ID ${id} not found for deletion`);
        return false;
      }
    } catch (error) {
      logger.error(`Error deleting alert with ID ${id}:`, error);
      throw error;
    }
  }
} 