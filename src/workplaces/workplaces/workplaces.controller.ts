import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth/guard/jwt-auth.guard';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Workplaces } from 'src/common/entities/workplaces.entity';
import { PaginationRequestDto } from 'src/common/pagination';
//import { TransformInterceptor } from 'src/transform.interceptor';
import { WorkplacesDto } from './dto/workplaces.dto';
import { WorkplacesService } from './workplaces.service';

@Controller('workplaces')
@UseGuards(JwtAuthGuard)
@ApiTags('Workplaces')
@ApiBearerAuth()
//@UseInterceptors(TransformInterceptor)
export class WorkplacesController {
  constructor(private readonly workplacesService: WorkplacesService) { }

  @Get()
  @ApiPaginatedResponse(WorkplacesDto)
  async findALL(@Query() paginationRequestDto: PaginationRequestDto): Promise<any> {
    return this.workplacesService.findAll(paginationRequestDto);
  }

  @Get('checkWorkplaceCode')
  checkWorkplacesCode(@Query('wpCode') wpCode: string,): Promise<any> {
    return this.workplacesService.checkWorkplacesCode(wpCode);
  }

  @Get('getListWorkplaces')
  getListWorkplaces(): Promise<any> {
    return this.workplacesService.getListWorkplaces();
  }

  @Post('create')
  @ApiBody({ type: WorkplacesDto })
  async create(@Body() data: Workplaces): Promise<any> {
    return this.workplacesService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any>{
    return this.workplacesService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateWorkplacesDto: WorkplacesDto): Promise<any> {
    return this.workplacesService.update(updateWorkplacesDto);
  }

  @Delete(':id')
  async delete(@Param('id') id): Promise<any> {
    return this.workplacesService.delete(id);
  }  
}
