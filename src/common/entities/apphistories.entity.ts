import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("app_histories")
export class AppHistories{
    
    @Column("int", { primary: true, name: "ah_id"})
    ahId: number;

    @Column("datetime", { name: "ah_updated_date", nullable: true})
    ahUpdatedDate: Date | null;

    @Column("varchar", { name: "ah_updated_by", nullable: true, length: 500 })
    ahUpdatedBy: string | null;

    @Column("varchar", { name: "ah_content", nullable: true, length: 500 })
    ahContent: string | null;
    
    @Column("int", { name: "ah_order", nullable: true})
    ah_order: number | null;

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

    @Column("int", { name: "at_id", nullable: true})
    appTypeId: number | null;

    @Column("varchar", { name: "app_avatar", nullable: true, length: 500 })
    appAvatar: string | null;

    @Column("int", { name: "app_status", nullable: true})
    appStatus: number;
}