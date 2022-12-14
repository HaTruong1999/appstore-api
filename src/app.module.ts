import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApptypesModule } from './apptypes/apptypes.module';
import { WorkplacesModule } from './workplaces/workplaces.module';
//import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsModule } from './apps/apps.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', ''),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    AppsModule,
    UsersModule,
    ApptypesModule,
    WorkplacesModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
