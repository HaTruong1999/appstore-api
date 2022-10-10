import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsController } from './apps/apps.controller';
import { Apps } from '../common/entities/apps.entity';
import { AppsService } from './apps/apps.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Apps]),
  ],
  controllers: [AppsController],
  providers: [AppsService]
})
export class AppsModule {}
