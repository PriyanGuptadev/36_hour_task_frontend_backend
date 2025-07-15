export interface Alert {
  _id: string;
  detectionTime: string;
  alertType: "mild" | "moderate" | "severe";
  audioFilePath: string;
  waveformData: number[];
  spectrogramData: number[][];
  suspectedReason: string;
  action: string;
  comment: string;
  equipment?: string; // Optional, if you want to display machine name
}

export interface AlertUpdate {
  action?: string;
  comment?: string;
  suspectedReason?: string;
}

export interface AlertFilters {
  startDate?: string;
  endDate?: string;
  alertType?: "mild" | "moderate" | "severe";
}
