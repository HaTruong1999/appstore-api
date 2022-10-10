import { PartialType } from '@nestjs/mapped-types';
import { PaginationRequestDto } from 'src/common/pagination';

export class UsersRequestDto extends PartialType(PaginationRequestDto){
}
