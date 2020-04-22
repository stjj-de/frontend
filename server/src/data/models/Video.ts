import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Video {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ type: "varchar" })
  title: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: "datetime", nullable: true, default: null })
  publicationDate: Date | null;

  @Field()
  @Column({ type: "varchar", unique: true, length: 20 })
  videoID: string;
}
