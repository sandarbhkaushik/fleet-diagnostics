import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticEvent } from '../diagnostics/entities/diagnostic-event.entity.js';
import { LogParserService } from '../diagnostics/parser/log-parser.service.js';

const VEHICLES = Array.from({ length: 15 }, (_, i) => String(1000 + i));

const CODES: Record<string, string[]> = {
  ERROR: [
    'U0420', 'P0301', 'P0171', 'P0300', 'P0440',
    'P0500', 'P0700', 'U0100',
  ],
  WARN: [
    'P0128', 'P0455', 'P0442', 'P0401',
    'B0001', 'C0035',
  ],
  INFO: [
    'EVT01', 'EVT02', 'EVT03', 'EVT04',
    'EVT05', 'EVT06',
  ],
};

const MESSAGES: Record<string, string[]> = {
  ERROR: [
    'Steering angle sensor malfunction',
    'Engine misfire detected on cylinder 1',
    'System too lean bank 1',
    'Random misfire detected',
    'Evaporative emission system malfunction',
    'Vehicle speed sensor malfunction',
    'Transmission control system malfunction',
    'Lost communication with ECM/PCM',
  ],
  WARN: [
    'Coolant thermostat below regulating temperature',
    'Evaporative emission system leak detected large',
    'Evaporative emission system leak detected small',
    'Exhaust gas recirculation flow insufficient',
    'Airbag deployment loop resistance high',
    'Left front wheel speed sensor circuit',
  ],
  INFO: [
    'Diagnostic check completed',
    'Vehicle engine started',
    'Vehicle engine stopped',
    'Firmware update applied successfully',
    'Heartbeat signal received',
    'GPS position updated',
  ],
};

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(DiagnosticEvent)
    private readonly repo: Repository<DiagnosticEvent>,
    private readonly parser: LogParserService,
  ) {}

  async seed(count = 500): Promise<number> {
    await this.repo.clear();

    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const lines: string[] = [];

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now - Math.random() * sevenDays);
      const vehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)]!;
      const level = this.weightedLevel();
      const codes = CODES[level]!;
      const messages = MESSAGES[level]!;
      const idx = Math.floor(Math.random() * codes.length);

      lines.push(this.formatLine(timestamp, vehicle, level, codes[idx]!, messages[idx]!));
    }

    // Ensure some vehicles are "critical" (3+ errors in last 24h)
    const recentBase = new Date(now - 6 * 60 * 60 * 1000);
    for (let i = 0; i < 4; i++) {
      const vehicle = VEHICLES[i]!;
      for (let j = 0; j < 4; j++) {
        const ts = new Date(recentBase.getTime() + Math.random() * 3 * 60 * 60 * 1000);
        const codes = CODES['ERROR']!;
        const messages = MESSAGES['ERROR']!;
        const idx = Math.floor(Math.random() * codes.length);
        lines.push(this.formatLine(ts, vehicle, 'ERROR', codes[idx]!, messages[idx]!));
      }
    }

    const events = this.parser.parseMultiple(lines.join('\n'));
    const entities = events.map((e) => this.repo.create({ ...e, rawLine: e.rawLine }));
    await this.repo.save(entities, { chunk: 100 });
    return entities.length;
  }

  // PDF format: [2025-07-24 14:21:08] [VEHICLE_ID:1234] [ERROR] [CODE:U0420] [Steering angle sensor malfunction]
  private formatLine(ts: Date, vehicle: string, level: string, code: string, message: string): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${ts.getFullYear()}-${pad(ts.getMonth() + 1)}-${pad(ts.getDate())} ${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}`;
    return `[${dateStr}] [VEHICLE_ID:${vehicle}] [${level}] [CODE:${code}] [${message}]`;
  }

  private weightedLevel(): 'INFO' | 'WARN' | 'ERROR' {
    const r = Math.random();
    if (r < 0.5) return 'INFO';
    if (r < 0.8) return 'WARN';
    return 'ERROR';
  }
}
