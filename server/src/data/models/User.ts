import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ type: "varchar", unique: true, length: 20 })
  username: string;

  @Field(() => String)
  @Column({ type: "varchar", nullable: true })
  displayName: string | null;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  position: string | null;

  @Column({ length: 60 })
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "char", length: 10, nullable: true, default: null })
  image: string | null;

  @Column({ type: "varchar", length: 50, unique: true, nullable: true })
  token: string | null;

  getDisplayName() {
    return this.displayName === null ? this.name : this.displayName;
  }
}
