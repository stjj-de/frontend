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
  @Column({ unique: false })
  username: string;

  @Field(() => String)
  @Column({ type: "varchar", nullable: true })
  displayName: string | null;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  position: string | null;

  @Field(() => Role)
  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn()
  role: Role;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "char", length: 32, nullable: true, default: null })
  image: string | null;

  getDisplayName() {
    return this.displayName === null ? `${this.firstName} ${this.lastName}` : this.displayName;
  }
}
