import { Column, Entity, PrimaryColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Content {
  @Field()
  @PrimaryColumn({ type: "varchar", length: 255, unique: true })
  id: string;

  @Field()
  @Column({ type: "text" })
  content: string;
}
