import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Pagination, PaginationRequestDto } from 'src/common/pagination';
import { Apps } from '../../common/entities/apps.entity';
import { AppsService } from './apps.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/ultils/file-upload.utils';
import { AppsDto } from './dto/apps.dto';
// import { TransformInterceptor } from 'src/transform.interceptor';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { AvatarDto } from 'src/users/users/dto/users.dto';

@Controller('apps')
@ApiTags('Apps')
@ApiBearerAuth()
// @UseInterceptors(TransformInterceptor)
export class AppsController {
    constructor(private readonly appsService: AppsService){}

  @Post('create')
  @ApiBody({ type: AppsDto })
  // @ApiCreatedResponse({ description: 'Tạo mới.', type: AppsDto })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() appsData: Apps, @Request() req): Promise<any> {
    return this.appsService.create(appsData, req.userId);
  }

  @Get()
  @ApiPaginatedResponse(AppsDto)
  async findALL(@Query() paginationRequestDto: PaginationRequestDto): Promise<Pagination<Apps>>{
    return this.appsService.findAll(paginationRequestDto);
  }

  @Get('checkAppCode')
  checkUserCode(
    @Query('appcode') appcode: string,
  ): Promise<any> {
    return this.appsService.checkAppCode(appcode);
  }

  @Get(':id')
  async findOne(@Param('id') id : number): Promise<any>{
    return this.appsService.findOne(id);
  }

  @Put(':id/update')
  async update(@Param('id') id, @Body() entityData: Apps, @Request() req): Promise<any> {
      entityData.appId = Number(id);
      return this.appsService.update(entityData, req.userId);
  }

  @Delete(':id/delete')
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
  async uploadedFile(
    @Body() body: AvatarDto,
    @UploadedFile() file,
  ) {
    return this.appsService.upload(body, file);
  }
}
