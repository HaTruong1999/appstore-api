import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards,Request, Res, Req } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UsersDto } from 'src/users/users/dto/users.dto';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiBody({ type: AuthDto })
    async login(@Body() authDto: AuthDto) {
        return this.authService.sign(authDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('checkToken')
    async checkToken(@Request() req: any) {
        return this.authService.checkToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('changePassword')
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

    @UseGuards(JwtAuthGuard)
    @Get('account')
    async account(
      @Req() req: any
    ) {
      return this.authService.findOne(req.user.userId)
    }

    //Cập nhật thông tin
    @UseGuards(JwtAuthGuard)
    @Post('/changeProfile')
    update(@Body() updateUsersDto: UsersDto, @Req() req: any) {
      return this.authService.update(
        req.user.userId,
        updateUsersDto
      );
    }
}
