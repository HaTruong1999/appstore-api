import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards,Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth/guard/jwt-auth.guard';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { AppTypes } from 'src/common/entities/apptypes.entity';
import { PaginationRequestDto } from 'src/common/pagination';
// import { TransformInterceptor } from 'src/transform.interceptor';
import { ApptypesService } from './apptypes.service';
import { AppTypesDto } from './dto/apptypes.dto';

@Controller('apptypes')
@UseGuards(JwtAuthGuard)
@ApiTags('AppTypes')
@ApiBearerAuth()
// @UseInterceptors(TransformInterceptor)
export class ApptypesController {
  constructor(private apptypesService: ApptypesService) {}

  @Get()
  @ApiPaginatedResponse(AppTypesDto)
  index(@Query() paginationRequestDto: PaginationRequestDto): Promise<any> {
    return this.apptypesService.findAll(paginationRequestDto);
  }

  @Get('checkAppTypeCode')
  checkAppTypeCode(@Query('appTypeCode') appTypeCode: string,): Promise<any> {
    return this.apptypesService.checkAppTypeCode(appTypeCode);
  }

  @Post('create')
  @ApiBody({ type: AppTypesDto })
  async create(@Body() appTypesData: AppTypes): Promise<any> {
    return this.apptypesService.create(appTypesData);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any>{
    return this.apptypesService.findOne(id);
  }

  @Patch()
  async update(
    @Body() updateAppTypesDto: AppTypes
  ): Promise<any> {
      return this.apptypesService.update(updateAppTypesDto);
  }

  @Delete(':id')
  async delete(@Param('id') id): Promise<any> {
    return this.apptypesService.delete(id);
  }  
}
