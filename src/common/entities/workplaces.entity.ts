import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("workplaces")
export class Workplaces{
    
    @Column("int", { primary: true, name: "wp_id"})
    wpId: number;

    @Column("varchar", { name: "wp_name", nullable: true, length: 500 })
    wpName: string | null;

    @Column("varchar", { name: "wp_parent", nullable: true, length: 500 })
    wpParent: string | null;

    @Column("int", { name: "wp_status", nullable: true})
    wpStatus: number;

    @Column("datetime", { name: "wp_created_date", nullable: true})
    wpCreatedDate: Date | null;

    @Column("varchar", { name: "wp_created_by", nullable: true, length: 500 })
    wpCreatedBy: string | null;

    @Column("datetime", { name: "wp_updated_date", nullable: true})
    wpUpdatedDate: Date | null;

    @Column("varchar", { name: "wp_updated_by", nullable: true, length: 500 })
    wpUpdatedBy: string | null;
}