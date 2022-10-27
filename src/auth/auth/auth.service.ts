import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/users.entity';
import { UsersService } from 'src/users/users/users.service';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { Like, Repository } from 'typeorm';
import { AvatarDto, UsersDto } from 'src/users/users/dto/users.dto';
const AVT_PATH = 'uploads/avatars/';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
// import path = require('path');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) { }

  async validateUser(userCode: string, pass: string): Promise<any> {
    // const user = await this.usersService.findUserByEmail(username);
    const user = await this.usersRepository.findOne({
      where: [
        { userEmail: Like(userCode) },
        { userCode: Like(userCode) },
      ]
    });

    if (user && user.userPassword === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async sign(userDto: any) {
    try {
      const user = await this.validateUser(userDto.username, userDto.password);
      if (user === null) {
        return {
          code: 0,
          data: {
            accessToken: "",
          },
          message: "sai tên đăng nhập hoặc mật khẩu"
        }
      } else if (user.userActive === 0) {
        return {
          code: 0,
          data: {
            codeErr: 'UNACTIVE',
            accessToken: "",
          },
          message: "Tài khoản chưa kích hoạt."
        }
      } else if (user.userActive === 2) {
        return {
          code: 0,
          data: {
            codeErr: 'LOCKED',
            accessToken: "",
          },
          message: "Tài khoản bị khóa."
        }
      }
      const payload = {
        userCode: user.userCode,
        userName: user.userName,
        sub: user.userId,
        userFullname: user.userFullname,
        userPhonenumber: user.userPhonenumber,
      };
      return {
        code: 1,
        data: {
          accessToken: this.jwtService.sign(payload),
          userFullname: payload.userFullname,
          userPhonenumber: payload.userPhonenumber,
        },
        message: "Đăng nhập thành công!",
      };
    } catch (error) {
      return {
        code: 0,
        data: {
          accessToken: "",
        },
        message: error,
      }
    }
  }

  async checkToken(user: any) {
    try {
      const users = await this.usersRepository.findOne(user.userId);
      if (users && users.userActive == 1)
        return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  async changePassword(req: ChangePasswordDto): Promise<any> {
    try {
      const user = await this.validateUser(req.username, req.password);
      if (user != null) {
        //-----  UPDATE PASSWORD ------
        user.userPassword = req.passwordNew;
        await this.usersRepository.update(user.userId, user);
        //const { userPassword, ...result } = user;
        return {
          code: 1,
          msg: 'Thay đổi mật khẩu thành công!'
        };
      } else {
        return {
          code: 0,
          msg: 'Mật khẩu không chính xác!'
        };
      }
    } catch (error) {
      console.log(error);
      return {
        code: 0,
        msg: 'Cập nhật mật khẩu thất bại!'
      };
    }

  }

  async findOne(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        return {
          code: 0,
          data: null,
          message: "Tài khoản không tồn tại."
        }
      } else {
        return {
          code: 1,
          data: user,
          message: "Lấy dữ liệu thành công."
        }
      };
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error,
      }
    }
  }

  async update(userId: string, usersDto: UsersDto) {
    try {
      const users = await this.usersRepository.findOne(userId);
      if (!users) {
        return {
          code: 0,
          data: null,
          message: "Người dùng không tồn tại!"
        }
      } else {
        users.userCode = usersDto.userCode.trim();
        users.userFullname = usersDto.userFullname.trim();
        users.userPhoneNumber = usersDto.userPhoneNumber;
        users.userBirthday = new Date(usersDto.userBirthday.toString());
        users.userGender = usersDto.userGender;
        users.userAddress = usersDto.userAddress.trim();
        users.userEmail = usersDto.userEmail.trim();
        //users.userAvatar = usersDto.userAvatar;
        users.userActive = usersDto.userActive;
        users.userUpdatedBy = usersDto.userUpdatedBy;
        users.userUpdatedDate = new Date();

        await this.usersRepository.update(userId, users);
        return {
          code: 1,
          data: users,
          message: "Cập nhật thành công!"
        }
      }
    } catch (err) {
      console.log(err);
      return {
        code: 0,
        data: null,
        message: err,
      }
    }
  }

  async upload(avatar: AvatarDto, file: any) {
    try {
      const userId = avatar.avatarID;
      const user = await this.usersRepository.findOne(userId);
      if (user == null) {
        // Delete the file
        await unlinkAsync(file.path)
        return {
          code: 0,
          data: null,
          message: 'Avatar ID không tồn tại',
        };
      } else {
        const oldUserAvatar = user.userAvatar;
        // ------- UPDATE AVATAR PATH ------
        user.userAvatar = AVT_PATH + file.filename;
        await this.usersRepository.update(userId, user);
        // Delete the file
        try {
          await unlinkAsync(oldUserAvatar);
        } catch (error) {
          console.log(error);
        }
        
        return {
          code: 1,
          data: {
            avatarID: userId,
            avatarSrc: AVT_PATH + file.filename,
          },
          message: "Cập nhật avatar thành công"
        };
      }

    } catch (error) {
      console.log(error);
      return {
        code: 0,
        data: null,
        message: error,
      };
    }
  }
}

