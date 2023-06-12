import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Purchase } from "./";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    discordId!: string

    @OneToMany(() => Purchase, (purchase) => purchase.user, { cascade: true })
    purchases!: Purchase[];

}
