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

@Query(() => Status,{ nullable: true } )
async getStatusById(
	@Arg("id",() => ID) id: number
): Promise<Status | null> {
	return this.statusService.getStatusById(id);
}

@Mutation(() => Status)
async createStatus(@Arg("data") data: CreateStatusInput): Promise<Status> {
 return this.statusService.createStatus(data.statusName);
}

@Mutation(() => ID)
async updateStatus(
	@Arg("id") id: number,
	@Arg("data") data: UpdateStatusInput
): Promise<number>{
	await this.statusService.updateStatus(id, data.statusName);
	return id;
}

	@Mutation(() => ID)
	async deleteStatus(
		@Arg("id") id:number): Promise<number> {
			return this.statusService.deleteStatus(id);
	}
}

		
	



 