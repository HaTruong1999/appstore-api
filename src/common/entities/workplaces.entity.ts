import { Column, Entity } from "typeorm";

@Entity("workplaces")
export class Workplaces{
    
    @Column("int", { primary: true, name: "wp_id"})
    wpId: number;

    @Column("varchar", { name: "wp_Code", nullable: true, length: 500 })
    wpCode: string | null;

    @Column("varchar", { name: "wp_name", nullable: true, length: 500 })
    wpName: string | null;

    @Column("int", { name: "wp_parent", nullable: true})
    wpParent: number | null;

    @Column("int", { name: "wp_order", nullable: true})
    wpOrder: number;

    @Column("int", { name: "wp_node", nullable: true})
    wpNode: number;

    @Column("int", { name: "wp_status", nullable: true})
    wpStatus: number;

    @Column("datetime", { name: "wp_created_date", nullable: true})
    wpCreatedDate: Date | null;

    @Column("int", { name: "wp_created_by", nullable: true})
    wpCreatedBy: number | null;

    @Column("datetime", { name: "wp_updated_date", nullable: true})
    wpUpdatedDate: Date | null;

    @Column("int", { name: "wp_updated_by", nullable: true})
    wpUpdatedBy: number | null;
}