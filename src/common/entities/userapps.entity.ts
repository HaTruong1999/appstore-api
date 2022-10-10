import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("userapps")
export class UserApps{
    
    @Column("int", { primary: true, name: "app_id"})
    appId: number;

    @Column("varchar", { name: "app_code", nullable: true, length: 500 })
    appCode: string | null;

    @Column("varchar", { name: "app_name", nullable: true, length: 500 })
    appName: string | null;

    @Column("varchar", { name: "app_description", nullable: true, length: 500 })
    appDescription: string | null;

    @Column("varchar", { name: "app_version", nullable: true, length: 500 })
    appVersion: string | null;

    @Column("varchar", { name: "app_package", nullable: true, length: 500 })
    appPackage: string | null;

    @Column("varchar", { name: "app_link", nullable: true, length: 500 })
    appLink: string | null;

    @Column("varchar", { name: "app_system", nullable: true, length: 500 })
    appSystem: string | null;

    @Column("varchar", { name: "app_subject", nullable: true, length: 500 })
    appSubject: string | null;

    @Column("varchar", { name: "app_wp_id", nullable: true, length: 500 })
    appWpId: string | null;

    // @OneToOne(() => AppTypes, (AppTypes) => AppTypes.atId)
    @Column("int", { name: "at_id", nullable: true})
    appTypeId: number | null;

    @Column("varchar", { name: "app_avatar", nullable: true, length: 500 })
    appAvatar: string | null;

    @Column("int", { name: "app_status", nullable: true})
    appStatus: number;

    @Column("int", { name: "ah_id", nullable: true})
    appHistoryId: string | null;

    @Column("datetime", { name: "app_created_date", nullable: true})
    appCreatedDate: Date | null;

    @Column("varchar", { name: "app_created_by", nullable: true, length: 500 })
    appCreatedBy: string | null;
}