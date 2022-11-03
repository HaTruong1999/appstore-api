import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'src/common/pagination';
import { AvatarDto } from 'src/users/users/dto/users.dto';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Apps } from '../../common/entities/apps.entity';
import { AppsRequestDto } from './dto/apps-request.dto';
const AVT_PATH = 'uploads/app/avatars/';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

@Injectable()
export class AppsService {
    constructor(
        @InjectRepository(Apps)
        private appsRepository: Repository<Apps>
      ) { }
      
    async create(appsData: Apps): Promise<any> {
      appsData.appCreatedDate = new Date();
      appsData.appUpdatedDate = new Date();
      try {
        const app = await this.appsRepository.save(appsData);
  
        return {
          code: 1,
          data: app,
          message: 'Tạo mới thành công.',
        }
      } catch (error) {
        return {
          code: 0,
          data: null,
          message: error,
        }
      }
    }

    async findAll(pagination: AppsRequestDto): Promise<Pagination<Apps>>{
        const search = pagination.search != null ? "%" + pagination.search.replace(' ', '%') + '%' : '';
        let filters = {};
        const listF = [];
        //Có tìm kiếm
        if(search != '')
        {
            listF.push({ appCode: Like(search) });
            listF.push({ appName: Like(search) });
        }
    
        if(listF.length > 0)
        {
          filters = { 
            where: listF
          };
        }
    
         let orders = { appCode: "DESC"};
        if(pagination.sort != null && pagination.sort != '')
          orders = JSON.parse(pagination.sort);
        
        return paginate<Apps>(this.appsRepository, { page: pagination.page, limit: pagination.limit }, filters, orders);
    }

    async findOne(id : number): Promise<any>{
      const app = await this.appsRepository.findOne(id);
      if(app){
        return {
          code: 1,
          data: app,
          message: 'Lấy thông tin ứng dụng thành công.',
        }
      }else{
        return {
          code: 0,
          data: null,
          message: 'Ứng dụng không tồn tại.',
        }
      }
    }

    async update(appsDto: Apps): Promise<any> {
      try {
        const app = await this.appsRepository.findOne(appsDto.appId);
        if(!app){
          return {
            code: 0,
            data: null,
            message: 'Ứng dụng không tồn tại.',
          }
        }else{
          app.appCode = appsDto.appCode.trim();
          app.appName = appsDto.appName.trim();
          app.appDescription = appsDto.appDescription.trim();
          app.appPackage = appsDto.appPackage.trim();
          app.appStatus = appsDto.appStatus;
          app.appVersion = appsDto.appVersion.trim();
          app.appUpdatedDate = new Date();
      
          try {
            await this.appsRepository.update(appsDto.appId, app);
            return {
              code: 1,
              data: app,
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

    async delete(id): Promise<DeleteResult> {
      return await this.appsRepository.delete(id);
    }

    async checkAppCode(appcode: string): Promise<any> {
      try {
        const user = await this.appsRepository.findOne({
          appCode: appcode
        });
    
        if(user){
          return {
            code: 1,
            data: {
              appcode: appcode,
              isExisted: true,
            },
            message: 'Mã ứng dụng đã tồn tại.',
          }
        }else{
          return {
            code: 1,
            data: {
              appcode: appcode,
              isExisted: false,
            },
            message: 'Mã ứng dụng hợp lệ.',
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

    async upload(avatar: AvatarDto, file: any) {
      try {
        const appId = avatar.avatarID;
        let app = await this.appsRepository.findOne(appId);
        if(app == null){
          app = await this.appsRepository.findOne({
            appCode: avatar.avatarID
          });
        }
          
        if (app == null) {
          // Delete the file
          await unlinkAsync(file.path)
          return {
            code: 0,
            data: null,
            message: 'Avatar ID ứng dụng không tồn tại',
          };
        } else {
          const oldAppAvatar = app.appAvatar;
          // ------- UPDATE AVATAR PATH ------
          app.appAvatar = AVT_PATH + file.filename;
          await this.appsRepository.update(app.appId, app);
          // Delete the file
          try {
            await unlinkAsync(oldAppAvatar);
          } catch (error) {
            console.log(error);
          }
          
          return {
            code: 1,
            data: {
              avatarID: app.appId,
              avatarSrc: AVT_PATH + file.filename,
            },
            message: "Cập nhật avatar ứng dụng thành công"
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
