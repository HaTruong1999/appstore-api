import { IsNumber, MaxLength, IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AppTypesDto {

    atId: number;

    @ApiProperty()
    atName: string | null;

    @ApiProperty()
    atDescription: string | null;

    @ApiProperty()
    @IsNumber()
    atStatus: number;

    @ApiProperty()
    atCreatedDate: Date | null;

    @ApiProperty()
    atCreatedBy: string | null;

    @ApiProperty()
    atUpdatedDate: Date | null;

    @ApiProperty()
    atUpdatedBy: string | null;

  }

  export class Meta {
    /**
    * Số lượng bản ghi của trang hiện tại
    */
     @ApiProperty()
     itemCount: number;
     /**
      * Tổng số lượng bản ghi
      */
     @ApiProperty()
     totalItems: number;
     /**
      * Số lượng bản ghi mỗi trang
      */
     @ApiProperty()
     itemsPerPage: number;
     /**
      * Tổng số trang
      */
     @ApiProperty()
     totalPages: number;
     /**
      * Trang hiện tại
      */
     @ApiProperty()
     currentPage: number;
 }
  export class AppTypesResponse {

    @ApiProperty()
    items: [AppTypesDto];

    @ApiProperty()
    meta : Meta;
  }



