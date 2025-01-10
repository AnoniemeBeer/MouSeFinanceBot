import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { User } from "./";
import { Recurrence } from "./Recurrence";

@Entity()
export class Subscription extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column({
        type: "enum",
        enum: Recurrence,
        default: Recurrence.MAANDELIJKS, // Default value
    })
    recurrence!: Recurrence;

    @Column({ type: "date" })
    startDate!: string;

    @ManyToOne(() => User, (user) => user.subscriptions)
    user!: User;
}
