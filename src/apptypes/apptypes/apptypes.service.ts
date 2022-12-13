import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { AppTypes } from 'src/common/entities/apptypes.entity';
import { paginate } from 'src/common/pagination';
import { Like, Repository } from 'typeorm';
import { AppTypesRequestDto } from './dto/apptypes-request.dto';

@Injectable()
export class ApptypesService {
  constructor(
    @InjectRepository(AppTypes)
    private apptypesRepository: Repository<AppTypes>
  ) { }

  async findAll(pagination: AppTypesRequestDto): Promise<any>{
    try {
      const search = pagination.search != null ? "%" + pagination.search.replace(' ', '%') + '%' : '';
      let filters = {};
      const listF = [];
      //Có tìm kiếm
      if(search != '')
      {
          listF.push({ atName: Like(search) });
          listF.push({ atDescription: Like(search) });
      }

      if(listF.length > 0)
      {
        filters = { 
          where: listF
        };
      }

      let orders = { atName: "DESC"};
      if(pagination.sort != null && pagination.sort != '')
        orders = JSON.parse(pagination.sort);

      // Handle before return
      const resultTemp = await paginate<AppTypes>(this.apptypesRepository, { page: pagination.page, limit: pagination.limit }, filters, orders);
      const result: any = resultTemp.items.map(e => e);

      return {
        code: 1,
        data: {
          items: result,
          meta: resultTemp.meta
        },
        message: "Lấy danh sách loại ứng dụng thành công."
      };
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message
      };
    }
    
  }

  async findOne(id: number){
    const data = await this.apptypesRepository.findOne(id);
    if(data){
      return {
        code: 1,
        data: data,
        message: 'Lấy thông tin thành công.',
      }
    }else{
      return {
        code: 0,
        data: null,
        message: 'Mã dụng không tồn tại.',
      }
    }
  }

  async create(data: AppTypes): Promise<any> {
    data.atCreatedDate = new Date();
    data.atUpdatedDate = new Date();
    try {
      const apptype = await this.apptypesRepository.save(data);

      return {
        code: 1,
        data: apptype,
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

  async update(data: AppTypes): Promise<any> {
    try {
      const apptype = await this.apptypesRepository.findOne(data.atId);
      if(!apptype){
        return {
          code: 0,
          data: null,
          message: 'Ứng dụng không tồn tại.',
        }
      }else{
        apptype.atCode = data.atCode.trim();
        apptype.atName = data.atName.trim();
        apptype.atDescription = data.atDescription ? data.atDescription.trim() : '';
        apptype.atStatus = data.atStatus;
        
        if(apptype.atUpdatedBy)
          apptype.atUpdatedBy = data.atUpdatedBy;
        apptype.atUpdatedDate = new Date();
    
        try {
          await this.apptypesRepository.update(data.atId, apptype);
          return {
            code: 1,
            data: apptype,
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

  async delete(id): Promise<any> {
    try {
      const data = await this.apptypesRepository.findOne(id);
      if(!data){
        return {
          code: 0,
          data: null,
          message: 'Ứng dụng không tồn tại.',
        }
      }else{
        try {
          await this.apptypesRepository.delete(id);
          return {
            code: 1,
            data: data,
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

  async checkAppTypeCode(appTypeCode: string): Promise<any> {
    try {
      const apptype = await this.apptypesRepository.findOne({
        atCode: appTypeCode
      });
  
      if(apptype){
        return {
          code: 1,
          data: {
            atCode: appTypeCode,
            isExisted: true,
          },
          message: 'Mã ứng dụng đã tồn tại.',
        }
      }else{
        return {
          code: 1,
          data: {
            atCode: appTypeCode,
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
}
