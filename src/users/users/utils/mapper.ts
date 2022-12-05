// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users } from "src/common/entities/users.entity";
import { UsersDto } from "../dto/users.dto";

export const toUsersDto = (data: Users): UsersDto => {
    const {
        userId,
        userCode,
        userPassword,
        userFullname,
        userPhoneNumber,
        userBirthday,
        userGender,  
        userAddress,
        userEmail,
        userAvatar,   
        userActive,
        userCreatedDate,
        userCreatedBy,
        userUpdatedDate,    
        userUpdatedBy, 
    } = data;
  
    const Users: UsersDto = {
        userId,
        userCode,
        userBirthday,
        userGender,
        userAddress,
        userEmail,
        userAvatar,
        userPassword,
        userFullname,
        userPhoneNumber,
        userActive,
        userCreatedDate,
        userCreatedBy,
        userUpdatedDate,
        userUpdatedBy
    };
    return Users;
  };
  