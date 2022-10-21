import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/users.entity';
import { UsersService } from 'src/users/users/users.service';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { Like, Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private usersService : UsersService,
        private jwtService: JwtService,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ){

    }

    async validateUser(userCode: string, pass: string): Promise<any> {
        // const user = await this.usersService.findUserByEmail(username);
        const user = await this.usersRepository.findOne({
          where: [
            { userEmail : Like(userCode) },
            { userCode : Like(userCode) },
          ]
        });
    
        if (user && user.userPassword === pass) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { userPassword, ...result } = user;
          return result;
        }
        return null;
      }
    
    async login(userDto) {
      const user = await this.validateUser(userDto.username, userDto.password);
      // console.log(user);
      if (user === null){
        return {
          code: 0,
          data:{
            accessToken: "",
          },
          message: "sai tên đăng nhập hoặc mật khẩu"
        }
      } else if(user.userActive === 0){
        return {
          code: 0,
          data:{
            codeErr: 'UNACTIVE',
            accessToken: "",
          },
          message: "Tài khoản chưa kích hoạt."
        }
      } else if(user.userActive === 2){
        return {
          code: 0,
          data:{
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
    }

    async checkToken(user: any)
    {
      try {
        const users = await this.usersRepository.findOne(user.userId);
        if(users && users.userActive == 1)
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
}
// function cryptPassword(passwordNew: string): any {
//   throw new Error('Function not implemented.');
// }

