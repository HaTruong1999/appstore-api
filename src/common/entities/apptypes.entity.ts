import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Apps } from "./apps.entity";

@Entity("app_types")
export class AppTypes{
    
    @Column("int", { primary: true, name: "at_id"})
    atId: number;

    @Column("varchar", { name: "at_code", nullable: true, length: 500 })
    atCode: string | null;

    @Column("varchar", { name: "at_name", nullable: true, length: 500 })
    atName: string | null;

    @Column("varchar", { name: "at_description", nullable: true, length: 500 })
    atDescription: string | null;

    @Column("int", { name: "at_status"})
    atStatus: number;

    @Column("datetime", { name: "at_created_date", nullable: true})
    atCreatedDate: Date | null;

    @Column("int", { name: "at_created_by", nullable: true })
    atCreatedBy: number | null;

    @Column("datetime", { name: "at_updated_date", nullable: true})
    atUpdatedDate: Date | null;

    @Column("int", { name: "at_updated_by", nullable: true})
    atUpdatedBy: number | null;
}