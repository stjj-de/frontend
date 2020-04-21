import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class UploadedFile {
  @Field(() => ID)
  @PrimaryColumn({ type: "char", length: 10 })
  id: string;

  @Field()
  @Column({ type: "varchar" })
  title: string;

  @Field()
  @Column({ type: "varchar" })
  mimeType: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", unique: true, nullable: true })
  alias: string | null;

  @Field()
  @CreateDateColumn()
  uploadDate: Date;
}
