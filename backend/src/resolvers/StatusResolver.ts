import {
	Arg,
	ID,
	Mutation,
	Resolver,
	Query,
} from "type-graphql";

import { Status } from "../entities/Status";
import { StatusService } from "../services/status.service";

import { StatusInput } from "../dtos/status.dto";

@Resolver(Status)
export class StatusResolver {
	private readonly statusService = new StatusService();

@Query(() => [Status])
async getAllStatus(): Promise<Status[]> {
	return this.statusService.getAllStatus();
}

@Query(() => Status)
async getStatusById(
  @Arg("id", () => ID) id: number): Promise<Status> {
		return this.statusService.getStatusById(id);
}

@Mutation(() => Status)
async createStatus(@Arg("data") data: StatusInput): Promise<Status> {
 return this.statusService.createStatus(data);
}

@Mutation(() => Status)
async updateStatus(
	@Arg("id", () => ID) id: number,
  @Arg("data") data: StatusInput): Promise<Status>{
return this.statusService.updateStatus(id, data);
}

@Mutation(() => Status)
async deleteStatus(
  @Arg("id", () => ID) id: number): Promise<Status> {
  return this.statusService.deleteStatus(id);
}

}

		
	



 