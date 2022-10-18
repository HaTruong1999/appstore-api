import { Column, Entity } from "typeorm";

@Entity("users")
export class Users {

    @Column("int", { primary: true, name: "user_id" })
    userId: number;

    @Column("varchar", { name: "user_code", nullable: true, length: 500 })
    userCode: string | null;

    @Column("varchar", { name: "user_password", nullable: true, length: 500 })
    userPassword: string | null;

    @Column("varchar", { name: "user_fullname", nullable: true, length: 500 })
    userFullname: string | null;

    @Column("varchar", { name: "user_phone_number", nullable: true, length: 500 })
    userPhoneNumber: string | null;

    @Column("datetime", { name: "user_birthday", nullable: true })
    userBirthday: Date | null;

    @Column("varchar", { name: "user_gender", nullable: true })
    userGender: number | null;

    @Column("varchar", { name: "user_address", nullable: true, length: 500 })
    userAddress: string | null;

    @Column("varchar", { name: "user_email", nullable: true, length: 500 })
    userEmail: string | null;

    @Column("varchar", { name: "user_avatar", nullable: true, length: 500 })
    userAvatar: string | null;

    @Column("int", { name: "user_active", nullable: true })
    userActive: number;

    @Column("datetime", { name: "user_created_date", nullable: true })
    userCreatedDate: Date | null;

    @Column("varchar", { name: "user_created_by", nullable: true, length: 500 })
    userCreatedBy: string | null;

    @Column("datetime", { name: "user_updated_date", nullable: true })
    userUpdatedDate: Date | null;

    @Column("varchar", { name: "user_updated_by", nullable: true, length: 500 })
    userUpdatedBy: string | null;
}