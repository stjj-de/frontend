import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable()
  authors: User[];

  @Field(() => Date, { nullable: true })
  @Column({ type: "datetime", nullable: true, default: null })
  publicationDate: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: "datetime", nullable: true, default: null })
  relevantUntil: Date | null;

  @Field(() => String)
  @Column({ type: "varchar", default: "" })
  excerpt: string;

  @Field(() => String)
  @Column({ type: "varchar", default: "" })
  content: string;
}
