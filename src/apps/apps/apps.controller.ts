import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PaginationRequestDto } from 'src/common/pagination';
import { Apps } from '../../common/entities/apps.entity';
import { AppsService } from './apps.service';
import {
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/ultils/file-upload.utils';
import { AppsDto } from './dto/apps.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { AvatarDto, FileDto } from 'src/users/users/dto/users.dto';
import { JwtAuthGuard } from 'src/auth/auth/guard/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService){}

  // =========== Data Normalization ===========
  @Get('synchDataApps')
  synchDataApps(): Promise<any> {
    return this.appsService.synchDataApps();
  }

  // ==========================================

  @Post('create')
  @ApiBody({ type: AppsDto })
  async create(@Body() appsData: Apps): Promise<any> {
    return this.appsService.create(appsData);
  }

  @Post('getStatisticDashboard')
  async getStatisticDashboard(@Body() data: any): Promise<any> {
    return this.appsService.getStatisticDashboard(data);
  }

  @Get()
  @ApiPaginatedResponse(AppsDto)
  async findALL(@Query() paginationRequestDto: PaginationRequestDto): Promise<any>{
    return this.appsService.findAll(paginationRequestDto);
  }

  @Get('checkAppCode')
  checkAppCode(@Query('appcode') appcode: string): Promise<any> {
    return this.appsService.checkAppCode(appcode);
  }

  @Get(':id')
  async findOne(@Param('id') id : number): Promise<any>{
    return this.appsService.findOne(id);
  }

  @Patch()
  async update(
    @Body() updateAppsDto: Apps
  ): Promise<any> {
      return this.appsService.update(updateAppsDto);
  }

  @Patch('deleteFile')
  async deleteFile(@Body() data: any): Promise<any> {
    return this.appsService.deleteFile(data);
  } 

  @Delete(':id')
  async delete(@Param('id') id): Promise<any> {
    return this.appsService.delete(id);
  }  

  @Post('changeAvatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/app/avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )

  async uploadedAvatar(
    @Body() body: AvatarDto,
    @UploadedFile() file,
  ) {
    return this.appsService.uploadAvatar(body, file);
  }

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/app/files',
        filename: editFileName,
      }),
    }),
  )
  async uploadedFile(
    @Body() body: FileDto,
    @UploadedFile() file,
  ) {
    return this.appsService.uploadFile(body, file);
  }

}
