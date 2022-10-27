import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/users.entity';
import { paginate, Pagination } from 'src/common/pagination';
import { Like, Repository } from 'typeorm';
import { UsersRequestDto } from './dto/users-request.dto';
import { UsersDto } from './dto/users.dto';
import { toUsersDto } from './utils/mapper';
const AVT_PATH = 'uploads/avatars/';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

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
    try {

      const user = await this.usersRepository.save(usersData);

      return {
        code: 1,
        data: user,
        message: 'Tạo mới thành công.',
      }
    } catch (error) {
      return {
        code: 1,
        data: null,
        message: error,
      }
    }
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

  async findOne(id: number): Promise<any> {
    const users = await this.usersRepository.findOne(id);
    if (!users) {
      return {
        code: 0,
        data: null,
        message: "Người dùng không tồn tại!"
      }
    }else{
      const userDto = toUsersDto(users);

      return {
        code: 1,
        data: userDto,
        message: "Lấy dữ liệu thành công!"
      }
    }
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
    // id: string,
    usersDto: UsersDto,
  ): Promise<any> {
    try {
      const users = await this.usersRepository.findOne(usersDto.userId);
      if(!users){
        return {
          code: 0,
          data: null,
          message: 'Người dùng không tồn tại.',
        }
      }else{
        users.userCode = usersDto.userCode.trim();
        users.userPassword = usersDto.userPassword.trim();
        users.userFullname = usersDto.userFullname.trim();
        users.userPhoneNumber = usersDto.userPhoneNumber;
        users.userBirthday = new Date(usersDto.userBirthday.toString());
        users.userGender = usersDto.userGender;
        users.userAddress = usersDto.userAddress.trim();
        users.userEmail = usersDto.userEmail.trim();
        users.userActive = usersDto.userActive;
        users.userUpdatedBy =  usersDto.userUpdatedBy;
        users.userUpdatedDate = new Date();
    
        try {
          await this.usersRepository.update(usersDto.userId, users);
          return {
            code: 1,
            data: users,
            message: 'Cập nhật thông tin thành công.',
          }
        } catch (error) {
          return {
            code: 0,
            data: null,
            message: error,
          }
        }
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error,
      }
    }
    
  }

  async remove(id: number): Promise<any> {
    try {
      const users = await this.usersRepository.findOne(id);
      if(users){
        await this.usersRepository.delete(id);
        if(users.userAvatar){
          try {
            await unlinkAsync(users.userAvatar);
          } catch (error) {
            console.log(error);
          }
        }

        return {
          code: 1,
          data: users,
          message: 'Xóa người dùng thành công.',
        }
      }
      return {
        code: 1,
        data: null,
        message: 'Người dùng không tồn tại.',
      }

    } catch (error) {
      return {
        code: 0,
        data: null,
        message: 'Xảy ra sự cố:' + error,
      }
    }
  }

  async checkUserCode(usercode: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        userCode: usercode
      });
  
      if(user){
        return {
          code: 1,
          data: {
            usercode: usercode,
            isExisted: true,
          },
          message: 'Mã người dùng đã tồn tại.',
        }
      }else{
        return {
          code: 1,
          data: {
            usercode: usercode,
            isExisted: false,
          },
          message: 'Mã người dùng hợp lệ.',
        }
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error,
      }
    }
  }
}

