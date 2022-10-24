import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards, Request, Res, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AvatarDto, UsersDto } from 'src/users/users/dto/users.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/ultils/file-upload.utils';
// const MAX_SIZE = 5242880; //5MB

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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
    if (result.code === 1) {
      return res.status(201).json({
        ...result,
        success: true,
      });
    } else {
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

  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: multer.diskStorage({
  //         destination: './uploads/avatars',
  //         filename: function (req, file, cb) {
  //           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //           cb(null, file.fieldname + '-' + uniqueSuffix);
  //           //avtSrc = file.fieldname + '-' + uniqueSuffix;
  //         }
  //       }),
  //     // storage: multer.memoryStorage(),
  //     // dest: './uploads/avatars',
  //     // limits: {
  //     //   fileSize: MAX_SIZE,
  //     // },
  //     // fileFilter: (req: any, file: any, cb: any) => {
  //     //   if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
  //     //     // Allow storage of file
  //     //     cb(null, true);
  //     //   } else {
  //     //     // Reject file
  //     //     cb(
  //     //       new HttpException(
  //     //         `Không hỗ trợ định dạng của file ${extname(file.originalname)}`,
  //     //         HttpStatus.BAD_REQUEST,
  //     //       ),
  //     //       false,
  //     //     );
  //     //   }
  //     // },
  //   }),
  // )
  // @UseInterceptors(FileInterceptor('file'))
  // @Post('changeAvatar')
  // async uploadFile(
  //   @Body() body: AvatarDto,
  //   @UploadedFile() file,
  //   @Req() req: any
  // ) {
  //   const ex = await FileType.fromBuffer(file.buffer);
  //   if (!ex.mime.match(/\/(jpg|jpeg|png|gif)$/)) {
  //     throw new HttpException(`Không hỗ trợ định dạng của file ${ex.ext}`, HttpStatus.BAD_REQUEST);
  //   }
  //   body.avatarID = req.user.userId;
  //   return this.authService.upload(body, file);
  // }

  @Post('changeAvatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(
    @Body() body: AvatarDto,
    @UploadedFile() file,
  ) {
    return this.authService.upload(body, file);
  }

}
