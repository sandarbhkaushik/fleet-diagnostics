import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DiagnosticEvent } from '../entities/diagnostic-event.entity.js';
import {
  SummaryDto,
  ErrorsPerVehicleDto,
  TopCodeDto,
  CriticalVehicleDto,
} from '../dto/event-response.dto.js';

export interface TimeRangeParams {
  from?: string;
  to?: string;
}

@Injectable()
export class AggregationService {
  constructor(
    @InjectRepository(DiagnosticEvent)
    private readonly repo: Repository<DiagnosticEvent>,
  ) {}

  private applyTimeRange(qb: SelectQueryBuilder<DiagnosticEvent>, range: TimeRangeParams): void {
    if (range.from) qb.andWhere('e.timestamp >= :from', { from: range.from });
    if (range.to) qb.andWhere('e.timestamp <= :to', { to: range.to });
  }

  async getSummary(range: TimeRangeParams = {}): Promise<SummaryDto> {
    const base = () => {
      const qb = this.repo.createQueryBuilder('e');
      this.applyTimeRange(qb, range);
      return qb;
    };

    const totalEvents = await base().getCount();
    const errorCount = await base().andWhere('e.level = :l', { l: 'ERROR' }).getCount();
    const warnCount = await base().andWhere('e.level = :l', { l: 'WARN' }).getCount();
    const infoCount = await base().andWhere('e.level = :l', { l: 'INFO' }).getCount();
    const criticalVehicles = await this.getCriticalVehicles();

    return {
      totalEvents,
      errorCount,
      warnCount,
      infoCount,
      criticalVehicleCount: criticalVehicles.length,
    };
  }

  async getErrorsPerVehicle(range: TimeRangeParams = {}): Promise<ErrorsPerVehicleDto[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .select('e.vehicleId', 'vehicleId')
      .addSelect('COUNT(*)', 'errorCount')
      .where('e.level = :level', { level: 'ERROR' });

    this.applyTimeRange(qb, range);

    const results = await qb
      .groupBy('e.vehicleId')
      .orderBy('errorCount', 'DESC')
      .getRawMany<{ vehicleId: string; errorCount: string }>();

    return results.map((r) => ({
      vehicleId: r.vehicleId,
      errorCount: Number(r.errorCount),
    }));
  }

  async getTopCodes(limit = 10, range: TimeRangeParams = {}): Promise<TopCodeDto[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .select('e.code', 'code')
      .addSelect('COUNT(*)', 'count');

    this.applyTimeRange(qb, range);

    const results = await qb
      .groupBy('e.code')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany<{ code: string; count: string }>();

    return results.map((r) => ({
      code: r.code,
      count: Number(r.count),
    }));
  }

  async getCriticalVehicles(): Promise<CriticalVehicleDto[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const results = await this.repo
      .createQueryBuilder('e')
      .select('e.vehicleId', 'vehicleId')
      .addSelect('COUNT(*)', 'recentErrorCount')
      .where('e.level = :level', { level: 'ERROR' })
      .andWhere('e.timestamp >= :since', { since })
      .groupBy('e.vehicleId')
      .having('COUNT(*) >= 3')
      .orderBy('recentErrorCount', 'DESC')
      .getRawMany<{ vehicleId: string; recentErrorCount: string }>();

    return results.map((r) => ({
      vehicleId: r.vehicleId,
      recentErrorCount: Number(r.recentErrorCount),
    }));
  }
}
