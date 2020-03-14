import { getConnection } from "typeorm";
import { Post } from "./models/Post";
import { User } from "./models/User";

export async function createSampleData() {
  // const role = new Role();
  // role.name = "Administrator";
  // role.pCreateUser = true;
  // await getConnection().getRepository(Role)
  //   .save(role);
  //
  // const user = new User();
  // user.name = "Moritz Ruth";
  // user.password = "";
  // user.role = role;
  // await getConnection().getRepository(User)
  //   .save(user);

  const post = new Post();
  post.slug = "rock-an-de-kerch-2020";
  post.title = "Rock an de Kerch 2020";
  post.publicationDate = new Date();
  post.relevantUntil = new Date(Date.now() + (1000 * 60 * 60));
  post.authors = [
    (await getConnection().getRepository(User)
      .findOne(1)
    )!
  ];
  await getConnection().getRepository(Post)
    .save(post);
}
