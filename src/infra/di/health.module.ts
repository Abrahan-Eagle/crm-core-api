import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckResource } from '@/infra/adapters';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckResource],
})
export class HealthModule {}
