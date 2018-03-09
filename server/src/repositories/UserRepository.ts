import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  getByUsername(username: string) {
    return this.findOne({ username });
  }
}
