import {
	Arg,
	Field,
	InputType,
	ID,
	Mutation,
	Resolver,
	Query,
} from "type-graphql";

import { Status } from "../entities/Status";
import { StatusService } from "../services/status.service";

@InputType()
class CreateStatusInput{
	@Field()
	statusName!:string;
}

@InputType()
class UpdateStatusInput{
	@Field()
	statusName!:string;
}

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
  const status = await this.statusService.getStatusById(id);
  if (!status) throw new Error("Status not found");
  return status;
}

@Mutation(() => Status)
async createStatus(@Arg("data") data: CreateStatusInput): Promise<Status> {
 return this.statusService.createStatus(data.statusName);
}

@Mutation(() => Status)
async updateStatus(
	@Arg("id", () => ID) id: number,
  @Arg("data") data: UpdateStatusInput): Promise<Status>{
return this.statusService.updateStatus(id, data.statusName);
}

}

		
	



 