import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsController } from './apps/apps.controller';
import { Apps } from '../common/entities/apps.entity';
import { AppsService } from './apps/apps.service';
import { Users } from 'src/common/entities/users.entity';
import { Workplaces } from 'src/common/entities/workplaces.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Apps, Users, Workplaces]),
  ],
  controllers: [AppsController],
  providers: [AppsService]
})
export class AppsModule {}
