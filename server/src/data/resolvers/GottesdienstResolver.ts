import { Arg, Authorized, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-koa";
import { EmptyResponse } from "../objectTypes/EmptyResponse";
import { Gottesdienst } from "../models/Gottesdienst";

@InputType()
export class CreateGottesdienstInput {
  @Field()
  time: string;

  @Field()
  location: string;

  @Field()
  description: string;
}

@InputType()
export class UpdateGottesdienstInput {
  @Field(() => String, { nullable: true })
  time?: string | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;
}

@Resolver()
export class GottesdienstResolver {
  @InjectRepository(Gottesdienst) private readonly gottesdienstRepository: Repository<Gottesdienst>;

  @Query(() => Gottesdienst, { nullable: true })
  gottesdienst(@Arg("id", () => ID) id: string) {
    return this.gottesdienstRepository.findOne(id);
  }

  @Query(() => [Gottesdienst])
  gottesdienste() {
    return this.gottesdienstRepository.find();
  }

  @Authorized()
  @Mutation(() => Gottesdienst)
  async createGottesdienst(@Arg("gottesdienst") data: CreateGottesdienstInput): Promise<Gottesdienst> {
    return this.applyDataToGottesdienstAndSave(new Gottesdienst(), data);
  }

  @Authorized()
  @Mutation(() => Gottesdienst)
  async updateGottesdienst(@Arg("id", () => ID) id: string, @Arg("gottesdienst") data: UpdateGottesdienstInput): Promise<Gottesdienst> {
    const event = await this.gottesdienstRepository.findOne(id);

    if (event === undefined) {
      throw new ApolloError("There is no gottesdienst with the specified ID.");
    }

    return this.applyDataToGottesdienstAndSave(event, data);
  }

  @Authorized()
  @Mutation(() => EmptyResponse)
  async deleteGottesdienst(@Arg("id", () => ID) id: string) {
    const event = await this.gottesdienstRepository.findOne(id);

    if (event === undefined) {
      throw new ApolloError("There is no gottesdienst with the specified ID.");
    }

    await this.gottesdienstRepository.remove(event);
    return new EmptyResponse();
  }

  private async applyDataToGottesdienstAndSave(gottesdienst: Gottesdienst, data: CreateGottesdienstInput | UpdateGottesdienstInput) {
    gottesdienst.time = data.time ?? gottesdienst.time;
    gottesdienst.location = data.location ?? gottesdienst.location;
    gottesdienst.description = data.description ?? gottesdienst.description;

    return this.gottesdienstRepository.save(gottesdienst);
  }
}
