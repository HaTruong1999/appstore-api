import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    username: string
    password: string
    passwordNew: string
}
