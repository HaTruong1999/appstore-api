import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Users } from 'src/common/entities/users.entity';
import {PaginationRequestDto } from 'src/common/pagination';
//import { TransformInterceptor } from 'src/transform.interceptor';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
//@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @ApiBody({ type: UsersDto })
  async create(@Body() usersData: Users): Promise<any> {
    return this.usersService.create(usersData);
  }

  @Patch(':id')
  update(
    @Body() updateUsersDto: UsersDto,
  ): Promise<any> {
    return this.usersService.update(updateUsersDto);
  }

  @Get()
  @ApiPaginatedResponse(UsersDto)
  async findALL(@Query() paginationRequestDto: PaginationRequestDto): Promise<any> {
    return this.usersService.findAll(paginationRequestDto);
  }

  @Get('checkUserCode')
  checkUserCode(
    @Query('usercode') usercode: string,
  ): Promise<any> {
    return this.usersService.checkUserCode(usercode);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID' })
  findOne(@Param('id') id: number): Promise<any> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID' })
  // @ApiOkResponse({ description: 'Xoá thành công.', type: UsersDto })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
