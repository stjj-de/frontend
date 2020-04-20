import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Gottesdienst {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ type: "varchar" })
  time: string;

  @Field()
  @Column({ type: "varchar" })
  location: string;

  @Field()
  @Column({ type: "varchar" })
  description: string;
}
