import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class MorningEmbed extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  guildId!: string;

  @Column()
  channelId!: string;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column({ nullable: true })
  imageUrl!: string | null;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ nullable: true })
  lastSentDate!: string | null;
}
