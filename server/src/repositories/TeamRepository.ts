import { EntityRepository, Repository } from "typeorm";
import { Team } from "../entity/Team";
import { User } from "../entity/User";

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {

  async createByUser(user: User, name: string) {
    const team = await this.create({
      name
    });

    team.addMember(user);
  }
}
