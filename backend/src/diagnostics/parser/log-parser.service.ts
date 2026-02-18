import { Injectable } from '@nestjs/common';

export interface ParsedEvent {
  timestamp: Date;
  vehicleId: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  code: string;
  message: string;
  rawLine: string;
}

@Injectable()
export class LogParserService {
  // PDF format: [2025-07-24 14:21:08] [VEHICLE_ID:1234] [ERROR] [CODE:U0420] [Steering angle sensor malfunction]
  private readonly LOG_REGEX =
    /^\[([^\]]+)\]\s+\[VEHICLE_ID:([^\]]+)\]\s+\[(INFO|WARN|ERROR)\]\s+\[CODE:([^\]]+)\]\s+\[([^\]]+)\]$/;

  parseLine(line: string): ParsedEvent | null {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const match = trimmed.match(this.LOG_REGEX);
    if (!match) return null;

    const [, timestamp, vehicleId, level, code, message] = match;
    return {
      timestamp: new Date(timestamp!),
      vehicleId: vehicleId!,
      level: level as ParsedEvent['level'],
      code: code!,
      message: message!,
      rawLine: trimmed,
    };
  }

  parseMultiple(text: string): ParsedEvent[] {
    return text
      .split('\n')
      .map((line) => this.parseLine(line))
      .filter((e): e is ParsedEvent => e !== null);
  }
}
