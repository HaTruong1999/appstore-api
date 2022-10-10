import { IPaginationMeta, ObjectLiteral } from './interfaces';

export class Pagination<PaginationObject, T extends ObjectLiteral = IPaginationMeta> {
  constructor(
    /**
     * Danh sách các bản ghi
     */
    public readonly items: PaginationObject[],
    /**
     * Thông tin phân trang
     */
    public readonly meta: T,
  ) { }
}