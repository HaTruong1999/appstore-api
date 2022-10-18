import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Users } from 'src/common/entities/users.entity';
import { Pagination, PaginationRequestDto } from 'src/common/pagination';
import { TransformInterceptor } from 'src/transform.interceptor';
import { UsersRequestDto } from './dto/users-request.dto';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @ApiBody({ type: UsersDto })
  @ApiCreatedResponse({ description: 'Tạo mới.', type: UsersDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() usersData: Users): Promise<any> {
    return this.usersService.create(usersData);
  }


  @Get()
  @ApiPaginatedResponse(UsersDto)
  async findALL(@Query() paginationRequestDto: PaginationRequestDto): Promise<Pagination<Users>> {
    return this.usersService.findAll(paginationRequestDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiOkResponse({ description: 'Tìm thấy thông tin.', type: UsersRequestDto })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiOkResponse({ description: 'Cập nhật  thành công.', type: UsersDto })
  update(
    @Param('id') id: string,
    @Body() updateUsersDto: UsersDto,
    //@Req() req: any,
  ) {
    return this.usersService.update(id, updateUsersDto, "");
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiOkResponse({ description: 'Xoá thành công.', type: UsersDto })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }


}
