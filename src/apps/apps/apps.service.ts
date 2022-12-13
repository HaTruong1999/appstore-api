import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'src/common/pagination';
import { AvatarDto, FileDto } from 'src/users/users/dto/users.dto';
import { Like, Repository } from 'typeorm';
import { Apps } from '../../common/entities/apps.entity';
import { AppsRequestDto } from './dto/apps-request.dto';
import { Users } from 'src/common/entities/users.entity';
import { Workplaces } from 'src/common/entities/workplaces.entity';


const AVT_PATH = 'uploads/app/avatars/';
const APP_FILE_PATH = 'uploads/app/files/';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

@Injectable()
export class AppsService {
  constructor(
      @InjectRepository(Apps)
      private appsRepository: Repository<Apps>,
      @InjectRepository(Users)
      private usersRepository: Repository<Users>,
      @InjectRepository(Workplaces)
      private workplacesRepository: Repository<Workplaces>,
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
        message: error.message,
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
    
    // Handle before return
    const resultTemp = await paginate<Apps>(this.appsRepository, { page: pagination.page, limit: pagination.limit }, filters, orders);
    const result: any = resultTemp.items.map(e => e);
    if(result){
      for await (const item of result) {
        try {
          if (item.appCreatedBy != null) {
            item.appCreatedBy = await this.usersRepository.findOne(item.appCreatedBy);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      items: result,
      meta: resultTemp.meta,
    };
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
        app.appDescription = appsDto.appDescription ? appsDto.appDescription.trim() : '';
        app.appPackage = appsDto.appPackage ? appsDto.appPackage.trim() : '';
        app.appLinkAndroid = appsDto.appLinkAndroid ? appsDto.appLinkAndroid.trim()  : '';
        app.appLinkIOS = appsDto.appLinkIOS ? appsDto.appLinkIOS.trim()  : '';
        app.appStatus = appsDto.appStatus;
        app.appWorkplaceId= appsDto.appWorkplaceId;
        app.appVersion = appsDto.appVersion ? appsDto.appVersion.trim() : '';
        if(appsDto.appUpdatedBy && typeof appsDto.appUpdatedBy != 'number')
          app.appUpdatedBy = Number.parseInt(appsDto.appUpdatedBy);
        else
          app.appUpdatedBy = appsDto.appUpdatedBy;
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
            message: error.message,
          }
        }
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message,
      }
    }
  }

  async delete(id: number): Promise<any> {
    try {
      const app = await this.appsRepository.findOne(id);
      if(!app){
        return {
          code: 0,
          data: null,
          message: 'Ứng dụng không tồn tại.',
        }
      }else{
        try {
          if(app.appAvatar)
            await unlinkAsync(app.appAvatar);
          if(app.appFileAndroid)
            await unlinkAsync(app.appFileAndroid);
          if(app.appFileIOS)
            await unlinkAsync(app.appFileIOS);
          await this.appsRepository.delete(id);
          return {
            code: 1,
            data: app,
            message: 'Xoá ứng dụng thành công.',
          }
        } catch (error) {
          return {
            code: 0,
            data: null,
            message: error.message,
          }
        }
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message,
      }
    }
  }

  async deleteFile(data: any): Promise<any> {
    try {
      const app = await this.appsRepository.findOne(data.id);
      if(!app){
        return {
          code: 0,
          data: null,
          message: 'Ứng dụng không tồn tại.',
        }
      }else{
        try {
          if(data.type === 'ANDROID'){
            if(app.appFileAndroid){
              try {
                await unlinkAsync(app.appFileAndroid);
                
              } catch (error) {
                console.log(error);
              }
              app.appFileAndroid = null;
              await this.appsRepository.update(app.appId, app);
            }
              
          }else if(data.type === 'IOS'){
            if(app.appFileIOS)
              try {
                await unlinkAsync(app.appFileIOS);
              } catch (error) {
              }
              app.appFileIOS = null;
              await this.appsRepository.update(app.appId, app);
          }
  
          return {
            code: 1,
            data: app,
            message: 'Xoá file ứng dụng thành công.',
          }
        } catch (error) {
          return {
            code: 0,
            data: null,
            message: error.message,
          }
        }
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message,
      }
    }
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
        message: error.message,
      }
    }
  }

  async uploadAvatar(avatar: AvatarDto, file: any) {
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
        message: error.message,
      };
    }
  }

  async uploadFile(fileInfo: FileDto, file: any) {
    try {
      const appId = fileInfo.fileID;
      let app = await this.appsRepository.findOne(appId);
      if(app == null){
        app = await this.appsRepository.findOne({
          appCode: fileInfo.fileID
        });
      }
        
      if (app == null) {
        // Delete the file
        await unlinkAsync(file.path)
        return {
          code: 0,
          data: null,
          message: 'File ID ứng dụng không tồn tại',
        };
      } else {
        let oldAppFile = ''
        if(fileInfo.fileType == 'ANDROID')
          oldAppFile = app.appFileAndroid;
        else
          oldAppFile = app.appFileIOS;

        // ------- UPDATE FILE PATH ------
        if(fileInfo.fileType == 'ANDROID')
          app.appFileAndroid = APP_FILE_PATH + file.filename;
        else
          app.appFileIOS = APP_FILE_PATH + file.filename;

        await this.appsRepository.update(app.appId, app);
        // Delete the file
        try {
          await unlinkAsync(oldAppFile);
        } catch (error) {
          console.log(error);
        }
        
        return {
          code: 1,
          data: {
            fileID: app.appId,
            fileSrc: APP_FILE_PATH + file.filename,
          },
          message: "Cập nhật file ứng dụng thành công"
        };
      }

    } catch (error) {
      console.log(error);
      return {
        code: 0,
        data: null,
        message: error.message,
      };
    }
  }

  // =========== Data Normalization ===========
  async synchDataApps(): Promise<any> {
    try {
      const apps = await this.appsRepository.find();

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      apps.forEach(async e => {
        e.appNumberDownloads = 2;
        await this.appsRepository.update(e.appId, e);
      })

      return {
        code: 1,
        data: null,
        message: 'Synch successfuly',
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message,
      }
    }
  }

  async getStatisticDashboard(data: any): Promise<any> {
    try {
      const arrWorkplaceId = data.wpIds;
      let numberOfApp = 0;
      let numberDownloads = 0;
      let numberOfUser = 0;
      let newUserInWeek = 0;
      const detailWorkplace: any[] = [];

      if(arrWorkplaceId){
        for(let i = 0; i < arrWorkplaceId.length; i ++){
          //Get number of app
          const conditionApp = {
            appWorkplaceId: arrWorkplaceId[i],
          };

          const countApp = await this.appsRepository.count(conditionApp);
          numberOfApp += countApp;

          //Get number of downloads
          const result = await this.appsRepository
            .createQueryBuilder('app')
            .where(`app.appWorkplaceId = ${arrWorkplaceId[i]}`)
            .select('SUM(app.appNumberDownloads)', 'countNumberDownloads')
            .getRawOne()
          numberDownloads += result.countNumberDownloads;

          //Get number of user
          const conditionUser = {
            userWorkplaceId: arrWorkplaceId[i],
          };

          const countUser = await this.usersRepository.count(conditionUser);
          numberOfUser += countUser;
          
          //New user in week
          let today = new Date();
          const diffStart = today.getDate() - today.getDay() + (today.getDay() == 0 ? -6 : 1);
          const startDate = new Date(today.setDate(diffStart));
          
          today = new Date();
          const diffEnd = today.getDate() - today.getDay() + (today.getDay() == 0 ? 0 : 7);
          const endDate = new Date(today.setDate(diffEnd));
   
          const tempCountUserInWeek = await this.usersRepository.createQueryBuilder('user')
            .where(`user.userWorkplaceId = ${arrWorkplaceId[i]} AND user.userCreatedDate BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`)
            .getCount();
          
          if(tempCountUserInWeek > 0) newUserInWeek += tempCountUserInWeek;

          //Detail app by workplace
          const conditionWorkplace = {
            wpId: arrWorkplaceId[i]
          }

          const workplace = await this.workplacesRepository.find({
            select: ['wpId', 'wpCode', 'wpName'],
            where: conditionWorkplace
          } as any);

          const tempWorkplace: any = {
            ...workplace[0],
            countApp: countApp,
            numberDownloads: result.countNumberDownloads,
            countUser: countUser,
          }

          detailWorkplace.push(tempWorkplace);
        }
      }

      const result = {
        numberOfApp: numberOfApp,
        numberDownloads: numberDownloads,
        numberOfUser: numberOfUser,
        newUserInWeek: newUserInWeek,
        workplaces: detailWorkplace,
      }

      return {
        code: 1,
        data: result,
        message: 'Successfuly',
      }
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message,
      }
    }
  }
}
