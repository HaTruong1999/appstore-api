import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workplaces } from 'src/common/entities/workplaces.entity';
import { paginate} from 'src/common/pagination';
import { Like, Repository } from 'typeorm';
import { WorkplacesRequestDto } from './dto/workplaces-request.dto';
import { WorkplacesDto } from './dto/workplaces.dto';

@Injectable()
export class WorkplacesService {

  notFoundMessage: string;

  constructor(
    @InjectRepository(Workplaces)
    private workplacesRepository: Repository<Workplaces>
  ) {
    this.notFoundMessage = 'Không tìm thấy';
  }

  async create(data: Workplaces): Promise<any> {
      data.wpCreatedDate = data.wpUpdatedDate = new Date();
      try {
          const wp = await this.workplacesRepository.save(data);

          return {
              code: 1,
              data: wp,
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

  async update(workplacesDto: WorkplacesDto): Promise<any> {
      try {
        const wp = await this.workplacesRepository.findOne(workplacesDto.wpId);
        if(!wp){
          return {
            code: 0,
            data: null,
            message: 'Người dùng không tồn tại.',
          }
        }else{
          wp.wpCode = workplacesDto.wpCode ? workplacesDto.wpCode.trim() : '';
          wp.wpName = workplacesDto.wpName ? workplacesDto.wpName.trim() : '';
          wp.wpParent = workplacesDto.wpParent;
          wp.wpNode = workplacesDto.wpNode;
          wp.wpOrder = workplacesDto.wpOrder;
          wp.wpStatus = workplacesDto.wpStatus;
          wp.wpUpdatedBy = workplacesDto.wpUpdatedBy;
          wp.wpUpdatedDate = new Date();
      
          try {
            await this.workplacesRepository.update(workplacesDto.wpId, wp);
            return {
              code: 1,
              data: wp,
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

  async findAll(pagination: WorkplacesRequestDto): Promise<any> {
    try {
      const search = pagination.search != null ? "%" + pagination.search.replace(' ', '%') + '%' : '';
      let filters = {};
      const listF = [];
      //Có tìm kiếm
      if (search != '') {
        listF.push({ wpName: Like(search) });
        listF.push({ wpCode: Like(search) });
      }

      if (listF.length > 0) {
        filters = {
          where: listF
        };
      }

      let orders = { wpName: "DESC" };
      if (pagination.sort != null && pagination.sort != '')
        orders = JSON.parse(pagination.sort);
      
      // Handle before return
      const resultTemp = await paginate<Workplaces>(this.workplacesRepository, { page: pagination.page, limit: pagination.limit }, filters, orders);
      const result: any[] = resultTemp.items.map(e => ({...e, numberChild: 0}));

      for(let i = 0; i < result.length; i++){
        let numberChild = 0;
        const arrChild = await this.workplacesRepository.find({
          wpParent: result[i].wpId
        });
        
        if(arrChild) numberChild = arrChild.length;
        result[i].numberChild = numberChild;
      }

      return {
        code: 1,
        data: {
          items: result,
          meta: resultTemp.meta
        },
        message: "Lấy danh sách đơn vị thành công."
      };
    } catch (error) {
      return {
        code: 0,
        data: null,
        message: error.message
      };
    }
  }

  async checkWorkplacesCode(wpCode: string): Promise<any> {
    try {
      const wp = await this.workplacesRepository.findOne({
        wpCode: wpCode
      });
  
      if(wp){
        return {
          code: 1,
          data: {
            wpCode: wpCode,
            isExisted: true,
          },
          message: 'Mã Đơn vị đã tồn tại.',
        }
      }else{
        return {
          code: 1,
          data: {
            atCode: wpCode,
            isExisted: false,
          },
          message: 'Mã đơn vị hợp lệ.',
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

  async findOne(id: number){
      const data = await this.workplacesRepository.findOne(id);
      if(data){
      return {
          code: 1,
          data: data,
          message: 'Lấy thông tin đơn vị thành công.',
      }
      }else{
      return {
          code: 0,
          data: null,
          message: 'Mã đơn vị không tồn tại.',
      }
      }
  }

  async delete(id): Promise<any> {
      try {
        const data = await this.workplacesRepository.findOne(id);
        if(!data){
          return {
            code: 0,
            data: null,
            message: 'Đơn vị không tồn tại.',
          }
        }else{
          try {
            await this.workplacesRepository.delete(id);
            return {
              code: 1,
              data: data,
              message: 'Xoá đơn vị thành công.',
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

  async getListWorkplacesAsTree(): Promise<any> {
    try {
      const data = await this.workplacesRepository.find();
  
      if(data){
        //map data to trees
        const dataTree = data.map((e) => ({
          ...e,
          children: [],
        }))

        const nodeRoot = {
          wpId: null,
          wpParent: '',
          children: []
        }

        this.mapTree(nodeRoot,dataTree);
        return {
          code: 1,
          data: nodeRoot.children,
          message: 'Lấy dữ liệu thành công.',
        }
      }else{
        return {
          code: 0,
          data: null,
          message: 'Dữ liệu rỗng',
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

  mapTree(node: any, data: any[]): any{
    data.forEach(element => {
      if(element.wpParent ===  node.wpId){
        node.children.push(element);
        this.mapTree(element, data);
      }
    });
    return node;
  }
}

