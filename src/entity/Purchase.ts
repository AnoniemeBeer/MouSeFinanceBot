import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Purchase extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    description!: string

    @Column()
    price!: number

    @Column()
    userId!: number

}
