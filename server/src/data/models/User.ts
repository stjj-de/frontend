import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Role } from "./Role";

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
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

  @Field(() => Role)
  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn()
  role: Role;

  @Field(() => String)
  @Column({ length: 60 })
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "char", length: 32, nullable: true, default: null })
  image: string | null;

  @Field(() => String)
  @Column({ type: "varchar", length: 50, unique: true, nullable: true })
  token: string | null;

  getDisplayName() {
    return this.displayName === null ? this.name : this.displayName;
  }
}
