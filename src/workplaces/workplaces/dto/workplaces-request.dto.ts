import { PartialType } from '@nestjs/mapped-types';
import { PaginationRequestDto } from 'src/common/pagination';

export class WorkplacesRequestDto extends PartialType(PaginationRequestDto){
}