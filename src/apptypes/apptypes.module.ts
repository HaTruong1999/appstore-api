import { Module } from '@nestjs/common';
import { ApptypesService } from './apptypes/apptypes.service';
import { ApptypesController } from './apptypes/apptypes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTypes } from 'src/common/entities/apptypes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppTypes]),
  ],
  providers: [ApptypesService],
  controllers: [ApptypesController]
})
export class ApptypesModule {}
