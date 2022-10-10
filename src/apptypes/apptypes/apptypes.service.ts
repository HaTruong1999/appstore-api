import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import e = require('express');
import { AppTypes } from 'src/common/entities/apptypes.entity';
import { paginate, Pagination } from 'src/common/pagination';
import { Like, Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';import { AppTypesRequestDto } from './dto/apptypes-request.dto';
import { AppTypesDto } from './dto/apptypes.dto';
;

@Injectable()
export class ApptypesService {
  constructor(
    @InjectRepository(AppTypes)
    private apptypesRepository: Repository<AppTypes>
  ) { }

  async findAll(pagination: AppTypesRequestDto): Promise<Pagination<AppTypes>>{
    let search = pagination.search != null ? "%" + pagination.search.replace(' ', '%') + '%' : '';
        let filters = {};
        let listF = [];
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
        return paginate<AppTypes>(this.apptypesRepository, { page: pagination.page, limit: pagination.limit }, filters, orders);
  }

  async findOne(id: number){
    return this.apptypesRepository.findOne(id);
  }

  async create(entity: AppTypes, createdBy): Promise<AppTypes> {
    entity.atCreatedBy = createdBy;
    return await this.apptypesRepository.save(entity);
  }

  async update(entity: AppTypes, updatedBy): Promise<UpdateResult> {
    entity.atUpdatedDate = new Date();
    entity.atUpdatedBy = updatedBy;
    return await this.apptypesRepository.update(entity.atId, entity)
  }

  async delete(id): Promise<DeleteResult> {
    return await this.apptypesRepository.delete(id);
  }
}
