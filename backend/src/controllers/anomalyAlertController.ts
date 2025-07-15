import { Request, Response } from "express";
import { AnomalyAlertService } from "../services/anomalyAlertService";
import { AudioProcessingService } from "../services/audioProcessingService";
import { ResponseHandler } from "../utils/responseHandler";
import { AlertFilters, UpdateAnomalyAlertRequest } from "../types/anomalyAlert";
import { logger } from "../config/logger";

export class AnomalyAlertController {
  private alertService: AnomalyAlertService;
  private audioService: AudioProcessingService;

  constructor() {
    this.alertService = new AnomalyAlertService();
    this.audioService = new AudioProcessingService();
  }

  /**
   * GET /alerts - Fetch list of anomaly records with optional filters
   */
  async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, alertType, page = 1, limit = 10 } = req.query;
      
      const filters: AlertFilters = {};
      if (startDate) filters.startDate = startDate as string;
      if (endDate) filters.endDate = endDate as string;
      if (alertType) filters.alertType = alertType as 'mild' | 'moderate' | 'severe';

      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;

      const { alerts, total } = await this.alertService.getAlerts(filters, pageNum, limitNum);

      ResponseHandler.success(res, "Alerts retrieved successfully", {
        alerts,
        total,
        page: pageNum,
        limit: limitNum
      });
    } catch (error) {
      logger.error("Error in getAlerts controller:", error);
      ResponseHandler.error(res, "Failed to retrieve alerts", 500);
    }
  }

  /**
   * GET /alerts/:id - Get specific alert details
   */
  async getAlertById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        ResponseHandler.error(res, "Alert ID is required", 400);
        return;
      }

      const alert = await this.alertService.getAlertById(id);
      
      if (!alert) {
        ResponseHandler.error(res, "Alert not found", 404);
        return;
      }

      ResponseHandler.success(res, "Alert retrieved successfully", alert);
    } catch (error) {
      logger.error(`Error in getAlertById controller for ID ${req.params.id}:`, error);
      ResponseHandler.error(res, "Failed to retrieve alert", 500);
    }
  }

  /**
   * PUT /alerts/:id - Update alert details
   */
  async updateAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, comment, suspectedReason } = req.body;

      if (!id) {
        ResponseHandler.error(res, "Alert ID is required", 400);
        return;
      }

      const updateData: UpdateAnomalyAlertRequest = {};
      if (action !== undefined) updateData.action = action;
      if (comment !== undefined) updateData.comment = comment;
      if (suspectedReason !== undefined) updateData.suspectedReason = suspectedReason;

      const updatedAlert = await this.alertService.updateAlert(id, updateData);
      
      if (!updatedAlert) {
        ResponseHandler.error(res, "Alert not found", 404);
        return;
      }

      ResponseHandler.success(res, "Alert updated successfully", updatedAlert);
    } catch (error) {
      logger.error(`Error in updateAlert controller for ID ${req.params.id}:`, error);
      ResponseHandler.error(res, "Failed to update alert", 500);
    }
  }

  /**
   * POST /alerts/upload - Upload audio file and create alert
   */
  async uploadAlert(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { alertType, suspectedReason, action, comment } = req.body;

      // Validate required fields
      if (!file) {
        ResponseHandler.error(res, "Audio file is required", 400);
        return;
      }

      if (!alertType || !['mild', 'moderate', 'severe'].includes(alertType)) {
        ResponseHandler.error(res, "Valid alert type (mild, moderate, severe) is required", 400);
        return;
      }

      if (!suspectedReason) {
        ResponseHandler.error(res, "Suspected reason is required", 400);
        return;
      }

      // Validate audio file
      await this.audioService.validateAudioFile(file.path);

      // Create alert record
      const alertData = {
        alertType,
        audioFilePath: file.path,
        suspectedReason,
        action: action || "",
        comment: comment || ""
      };

      const newAlert = await this.alertService.createAlert(alertData);

      // Generate audio analysis data asynchronously
      this.generateAudioAnalysis(newAlert._id!.toString(), file.path);

      ResponseHandler.success(res, "Alert created successfully", newAlert, 201);
    } catch (error) {
      logger.error("Error in uploadAlert controller:", error);
      ResponseHandler.error(res, "Failed to create alert", 500);
    }
  }

  /**
   * Generate audio analysis data asynchronously
   */
  private async generateAudioAnalysis(alertId: string, audioFilePath: string): Promise<void> {
    try {
      // Generate waveform and spectrogram data
      const [waveformData, spectrogramData] = await Promise.all([
        this.audioService.generateWaveformData(audioFilePath),
        this.audioService.generateSpectrogramData(audioFilePath)
      ]);

      // Update alert with audio analysis data
      await this.alertService.updateAudioData(alertId, waveformData, spectrogramData);
      
      logger.info(`Audio analysis completed for alert: ${alertId}`);
    } catch (error) {
      logger.error(`Error generating audio analysis for alert ${alertId}:`, error);
    }
  }
} 