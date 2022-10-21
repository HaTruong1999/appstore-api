import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/users.entity';
import { paginate, Pagination } from 'src/common/pagination';
import { Like, Repository } from 'typeorm';
import { UsersRequestDto } from './dto/users-request.dto';
import { UsersDto } from './dto/users.dto';
import { toUsersDto } from './utils/mapper';

@Injectable()
export class UsersService {

  notFoundMessage: string;

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {
    this.notFoundMessage = 'Không tìm thấy';
  }

  async create(usersData: Users): Promise<any> {
    usersData.userCreatedDate = new Date();
    return await this.usersRepository.save(usersData);
  }

  async findAll(pagination: UsersRequestDto): Promise<Pagination<Users>> {
    const search = pagination.search != null ? "%" + pagination.search.replace(' ', '%') + '%' : '';
    let filters = {};
    const listF = [];
    //Có tìm kiếm
    if (search != '') {
      listF.push({ userFullname: Like(search) });
      listF.push({ userCode: Like(search) });
    }

    if (listF.length > 0) {
      filters = {
        where: listF
      };
    }

    let orders = { userFullname: "DESC" };
    if (pagination.sort != null && pagination.sort != '')
      orders = JSON.parse(pagination.sort);
    return paginate<Users>(this.usersRepository, { page: pagination.page, limit: pagination.limit }, filters, orders);

  }

  async findOne(id: number): Promise<UsersDto> {
    const users = await this.usersRepository.findOne(id);
    if (!users) {
      throw new NotFoundException(this.notFoundMessage);
    }

    const userDto = toUsersDto(users);

    return userDto;
  }

  async findUserByEmail(email: string): Promise<UsersDto> {
    const users = await this.usersRepository.findOne({
      where: [
        { userEmail: Like(email) },
      ]
    });

    if (!users) {
      throw new NotFoundException(this.notFoundMessage);
    }

    const userDto = toUsersDto(users);
    if (userDto == undefined) {
      return null;
    }
    return userDto;
  }

  async update(
    id: string,
    usersDto: UsersDto,
  ): Promise<Users> {
    const users = await this.usersRepository.findOne(id);
    //User

    users.userCode = usersDto.userCode.trim();
    users.userPassword = usersDto.userPassword.trim();
    users.userFullname = usersDto.userFullname.trim();
    users.userPhoneNumber = usersDto.userPhoneNumber;
    users.userBirthday = new Date(usersDto.userBirthday.toString());
    users.userGender = usersDto.userGender;
    users.userAddress = usersDto.userAddress.trim();
    users.userEmail = usersDto.userEmail.trim();
    users.userAvatar = usersDto.userAvatar;
    users.userActive = usersDto.userActive;
    users.userUpdatedBy =  usersDto.userUpdatedBy;
    users.userUpdatedDate = new Date();

    await this.usersRepository.update(id, users);
    return users;
  }

  async remove(id: number): Promise<Users> {
    const users = await this.usersRepository.findOne(id);

    await this.usersRepository.delete(id);
    return users;
  }

}
