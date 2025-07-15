import { ObjectId } from "mongodb";

export type AlertType = 'mild' | 'moderate' | 'severe';

export interface AnomalyAlert {
  _id?: ObjectId;
  detectionTime: Date;
  alertType: AlertType;
  audioFilePath: string;
  waveformData: number[];
  spectrogramData: number[][];
  suspectedReason: string;
  action: string;
  comment: string;
}

export interface CreateAnomalyAlertRequest {
  alertType: AlertType;
  audioFilePath: string;
  suspectedReason: string;
  action?: string;
  comment?: string;
}

export interface UpdateAnomalyAlertRequest {
  action?: string;
  comment?: string;
  suspectedReason?: string;
}

export interface AlertFilters {
  startDate?: string;
  endDate?: string;
  alertType?: AlertType;
}

export interface AlertListResponse {
  success: boolean;
  message: string;
  data: {
    alerts: AnomalyAlert[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AlertResponse {
  success: boolean;
  message: string;
  data: AnomalyAlert;
} 