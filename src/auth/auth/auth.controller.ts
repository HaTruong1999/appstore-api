import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Body, Controller, Get, Post, UseGuards,Request, Res } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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

    @UseGuards(LocalAuthGuard)
    @Get('checkToken')
    async checkToken(@Request() req: any) {
        return this.authService.checkToken(req.user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('changePassword')
   // @ApiResponse({ status: 201, description: 'Đổi mật khẩu thành công.'})
    @ApiBody({ type: ChangePasswordDto })
    async changePassword(
        @Body() change: ChangePasswordDto,
        @Res() res: Response,
    ) {
        const result = await this.authService.changePassword(change);
        if(result.code === 1){
            return res.status(201).json({
                ...result,
                success: true,
            });
        }else{
            return res.status(200).json({
                success: false,
                ...result,
            });
        }
    }
}
