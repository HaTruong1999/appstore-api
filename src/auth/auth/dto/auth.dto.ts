import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({
        description: 'Tên đăng nhập',
        required: true,
    })
    username: string
    @ApiProperty({
        description: 'Mật khẩu',
        required: true,
    })
    password: string
}
