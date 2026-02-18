export interface Summary {
  totalEvents: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  criticalVehicleCount: number;
}

export interface ErrorsPerVehicle {
  vehicleId: string;
  errorCount: number;
}

export interface TopCode {
  code: string;
  count: number;
}

export interface CriticalVehicle {
  vehicleId: string;
  recentErrorCount: number;
}
