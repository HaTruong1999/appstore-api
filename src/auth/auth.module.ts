import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
// import { UsersService } from 'src/users/users/users.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';

@Module({
  imports: [
    JwtModule.register({
      privateKey: jwtConstants.privateKey,
      publicKey: jwtConstants.publicKey,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'RS256',
      },
    }),
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
