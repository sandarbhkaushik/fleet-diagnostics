import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticEvent } from '../entities/diagnostic-event.entity.js';
import { QueryEventsDto } from '../dto/query-events.dto.js';
import { PaginatedEventsDto } from '../dto/event-response.dto.js';
import { LogParserService } from '../parser/log-parser.service.js';

@Injectable()
export class DiagnosticsService {
  constructor(
    @InjectRepository(DiagnosticEvent)
    private readonly repo: Repository<DiagnosticEvent>,
    private readonly parser: LogParserService,
  ) {}

  async findAll(query: QueryEventsDto): Promise<PaginatedEventsDto> {
    const { vehicle, code, level, from, to, page = 1, limit = 20 } = query;

    const qb = this.repo.createQueryBuilder('e');

    if (vehicle) qb.andWhere('e.vehicleId = :vehicle', { vehicle });
    if (code) qb.andWhere('e.code = :code', { code });
    if (level) qb.andWhere('e.level = :level', { level });
    if (from) qb.andWhere('e.timestamp >= :from', { from });
    if (to) qb.andWhere('e.timestamp <= :to', { to });

    qb.orderBy('e.timestamp', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<DiagnosticEvent> {
    const event = await this.repo.findOneBy({ id });
    if (!event) throw new NotFoundException(`Event #${id} not found`);
    return event;
  }

  async ingest(rawText: string): Promise<{ ingested: number; failed: number }> {
    if (!rawText || typeof rawText !== 'string') {
      throw new BadRequestException('Request body must be plain text log lines');
    }

    const parsed = this.parser.parseMultiple(rawText);
    const totalLines = rawText.split('\n').filter((l) => l.trim()).length;

    if (parsed.length > 0) {
      const entities = parsed.map((e) => this.repo.create({ ...e, rawLine: e.rawLine }));
      await this.repo.save(entities, { chunk: 100 });
    }

    return { ingested: parsed.length, failed: totalLines - parsed.length };
  }
}
