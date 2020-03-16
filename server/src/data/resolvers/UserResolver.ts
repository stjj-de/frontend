import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../models/User";

@Resolver(() => User)
export class UserResolver implements ResolverInterface<User> {
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  @FieldResolver()
  async role(@Root() user: User) {
    return (await this.userRepository.findOne(user.id, { select: ["id"], relations: ["role"] }))!.role;
  }

  @FieldResolver()
  async displayName(@Root() user: User) {
    return user.getDisplayName();
  }
}
