import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/auth/guard/jwt-auth.guard';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { AppTypes } from 'src/common/entities/apptypes.entity';
import { Pagination, PaginationRequestDto } from 'src/common/pagination';
import { TransformInterceptor } from 'src/transform.interceptor';
import { ApptypesService } from './apptypes.service';
import { AppTypesRequestDto } from './dto/apptypes-request.dto';
import { AppTypesDto, AppTypesResponse } from './dto/apptypes.dto';


@Controller('apptypes')
@UseGuards(JwtAuthGuard)
@ApiTags('AppTypes')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class ApptypesController {
  constructor(private apptypesService: ApptypesService) {}

  @Get()
  @ApiPaginatedResponse(AppTypesDto)
  index(@Query() paginationRequestDto: PaginationRequestDto, @Request() req): Promise<Pagination<AppTypes>> {
    return this.apptypesService.findAll(paginationRequestDto);
  }

  @Post('create')
  @ApiBody({ type: AppTypesDto })
  @ApiCreatedResponse({ description: 'Tạo mới.', type: AppTypesDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() appTypesData: AppTypes, @Request() req): Promise<any> {
    return this.apptypesService.create(appTypesData, req.userId);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: AppTypesDto,
  })
  async findOne(@Param('id') id: number){
    return this.apptypesService.findOne(id);
  }

  @Put(':id/update')
  async update(@Param('id') id, @Body() entityData: AppTypes, @Request() req): Promise<any> {
      entityData.atId = Number(id);
      return this.apptypesService.update(entityData, req.userId);
  }

  @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.apptypesService.delete(id);
  }  
}
