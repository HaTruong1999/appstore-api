import { IsNumber, IsDate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {

  userId: number;

  @ApiProperty()
  userCode: string | null;

  @ApiProperty()
  userPassword: string | null;

  @ApiProperty()
  userFullname: string | null;

  @ApiProperty()
  userPhoneNumber: string | null;

  @ApiProperty()
  @IsDate()
  userBirthday: Date | null;

  @ApiProperty()
  userGender: number | null;

  @ApiProperty()
  userAddress: string | null;

  @ApiProperty()
  userEmail: string | null;

  @ApiProperty()
  userAvatar: string | null;

  @ApiProperty()
  @IsNumber()
  userActive: number;

  @ApiProperty()
  @IsDate()
  userCreatedDate: Date | null;

  @ApiProperty()
  userCreatedBy: string | null;

  @ApiProperty()
  @IsDate()
  userUpdatedDate: Date | null;

  @ApiProperty()
  userUpdatedBy: string | null;

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



