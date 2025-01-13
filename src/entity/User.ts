import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Purchase } from "./";
import { Subscription } from "./";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  discordId!: string;

  @OneToMany(() => Purchase, (purchase) => purchase.user, { cascade: true })
  purchases!: Purchase[];

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  subscriptions!: Subscription[];
}
