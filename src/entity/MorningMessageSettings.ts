import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class MorningMessageSettings extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "varchar", nullable: true })
  guildId!: string | null;

  @Column({ type: "varchar", nullable: true })
  channelId!: string | null;

  @Column({ type: "varchar", nullable: true })
  lastSentDate!: string | null;

  @Column({ type: "varchar", nullable: true })
  scheduledFor!: string | null;
}
