export type SeverityLevel = 'INFO' | 'WARN' | 'ERROR';

export interface DiagnosticEvent {
  id: number;
  timestamp: string;
  vehicleId: string;
  level: SeverityLevel;
  code: string;
  message: string;
  rawLine: string;
}

export interface PaginatedEvents {
  data: DiagnosticEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventFilter {
  vehicle?: string;
  code?: string;
  level?: SeverityLevel | '';
  from?: string;
  to?: string;
  page: number;
  limit: number;
}
