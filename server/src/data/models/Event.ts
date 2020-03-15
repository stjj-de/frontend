import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { User } from "./User";
import { Post } from "./Post";

export enum EventColor {
  GRAY = "gray",
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  GREEN = "green",
  TEAL = "teal",
  BLUE = "blue",
  INDIGO = "indigo",
  PURPLE = "purple",
  PINK = "pink"
}

registerEnumType(EventColor, {
  name: "EventColor",
  description: "The color of the event."
});

@Entity()
@ObjectType()
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => Date)
  @Column({ type: "datetime" })
  date: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: "datetime", nullable: true, default: null })
  endDate: Date | null;

  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable()
  creators: User[];

  @Field(() => EventColor)
  @Column({
    type: "enum",
    enum: EventColor,
    default: EventColor.GRAY
  })
  color: EventColor;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true, default: null })
  description: string | null;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn()
  relatedPost: Post | null;
}
