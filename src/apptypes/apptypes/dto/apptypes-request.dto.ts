import { PartialType } from '@nestjs/mapped-types';
import { PaginationRequestDto } from 'src/common/pagination';

export class AppTypesRequestDto extends PartialType(PaginationRequestDto){
}
