import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/users.entity';
import { UsersService } from 'src/users/users/users.service';
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

    async validateUser(username: string, pass: string): Promise<any> {
        // const user = await this.usersService.findUserByEmail(username);
        const user = await this.usersRepository.findOne({
          where: [
            { userEmail : Like(username) },
            { userCode : Like(username) },
          ]
        });
    
        if (user && user.userPassword === pass) {
          const { userPassword, ...result } = user;
          return result;
        }
        return null;
      }
    
    async login(userDto) {
      let user = await this.validateUser(userDto.username, userDto.password);
      // console.log(user);
      if (user == null) return {
        code: 0,
        data:{
          accessToken: "",
        },
        message: "Đăng nhập thất bại."
      };
      const payload = {
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
}
