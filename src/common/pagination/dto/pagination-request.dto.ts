import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationRequestDto{

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
      })
      @Type(() => Number)
      @IsInt()
      @Min(1)
      @IsOptional()
    page: number;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
      })
      @Type(() => Number)
      @IsInt()
      @Min(1)
      @Max(50)
      @IsOptional()
    limit: number;

    @ApiProperty({description : 'Tìm kiếm', required: false, default: null})
    search: string;

    @ApiProperty({description : 'Sắp xếp theo field. VD: {"wpName":"ASC"} ==> Sắp xếp fiels wpName theo chiều tăng dần', required: false, default: null})
    sort: string;
}