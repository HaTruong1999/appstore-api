import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'src/common/pagination';
import { Like, Repository } from 'typeorm';
import { Apps } from '../../common/entities/apps.entity';
import { AppsRequestDto } from './dto/apps-request.dto';

@Injectable()
export class AppsService {
    constructor(
        @InjectRepository(Apps)
        private appsRepository: Repository<Apps>
      ) { }
      
    async create(appsData: Apps, createdBy): Promise<any> {
      
      appsData.appCreatedDate = new Date();
      appsData.appCreatedBy = createdBy; // Mã người cập nhật
      return await this.appsRepository.save(appsData);
    }

    async findAll(pagination: AppsRequestDto): Promise<Pagination<Apps>>{
        let search = pagination.search != null ? "%" + pagination.search.replace(' ', '%') + '%' : '';
        let filters = {};
        let listF = [];
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
    async findOne(id : number){
      return this.appsRepository.findOne(id);
    }
}
