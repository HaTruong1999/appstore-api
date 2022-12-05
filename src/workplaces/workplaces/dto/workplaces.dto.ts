import { ApiProperty } from '@nestjs/swagger';

export class WorkplacesDto {

  wpId: number;

  @ApiProperty()
  wpCode: string | null;

  @ApiProperty()
  wpName: string | null;

  @ApiProperty()
  wpParent: number | null;

  @ApiProperty()
  wpStatus: number;

  @ApiProperty()
  wpCreatedDate: Date | null;

  @ApiProperty()
  wpCreatedBy: number | null;

  @ApiProperty()
  wpUpdatedDate: Date | null;

  @ApiProperty()
  wpUpdatedBy: number | null;
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

export class AvatarDto {
  avatarID: string;
  avatarSrc: string;
}

export class FileDto {
  fileID: string;
  fileType: string;
}



