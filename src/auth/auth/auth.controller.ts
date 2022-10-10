import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: AuthDto })
    @ApiResponse({ status: 200, description: 'Đăng nhập thành công.'})
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }
}
