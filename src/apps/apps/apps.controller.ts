import { Body, Controller, Get, Param, Post, Query, Request, UseInterceptors } from '@nestjs/common';
import { Pagination, PaginationRequestDto } from 'src/common/pagination';
import { Apps } from '../../common/entities/apps.entity';
import { AppsService } from './apps.service';
import { AppsRequestDto } from './dto/apps-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBody
} from '@nestjs/swagger';
import { AppsDto } from './dto/apps.dto';
import { TransformInterceptor } from 'src/transform.interceptor';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@Controller('apps')
@ApiTags('Apps')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class AppsController {
    constructor(private readonly appsService: AppsService){}

  @Post('create')
  @ApiBody({ type: AppsDto })
  @ApiCreatedResponse({ description: 'Tạo mới.', type: AppsDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() appsData: Apps, @Request() req): Promise<any> {
    return this.appsService.create(appsData, req.userId);
  }

  
  @Get()
  @ApiPaginatedResponse(AppsDto)
  async findALL(@Query() paginationRequestDto: PaginationRequestDto): Promise<Pagination<Apps>>{
    return this.appsService.findAll(paginationRequestDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: AppsDto
  })
  async findOne(@Param('id') id : number){
    return this.appsService.findOne(id);
  }

}
