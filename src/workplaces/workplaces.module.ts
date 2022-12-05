import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workplaces } from 'src/common/entities/workplaces.entity';
import { WorkplacesController } from './workplaces/workplaces.controller';
import { WorkplacesService } from './workplaces/workplaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workplaces]),
  ],
  controllers: [WorkplacesController],
  providers: [WorkplacesService],
  exports:[WorkplacesService]
})
export class WorkplacesModule {}