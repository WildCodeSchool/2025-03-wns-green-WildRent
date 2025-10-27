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

@Query(() => [Status])
async getAllStatus(): Promise<Status[]> {
	try{
		const status = await Status.find();
		return status;

	}catch (err) {
		throw new Error (`Error fetching status: ${err}`);
	}
}

@Query(() => Status )
async getStatusById(
	@Arg("id",() => ID) id: number
): Promise<Status | null> {
	try {
		const status = await Status.findOne({where : {id}});
		return status;
} catch (err) {
		throw new Error (`Error fetching status ${id}: ${err}`);
	}
}

@Mutation(() => Status)
async createStatus(
	@Arg("data") data: CreateStatusInput
): Promise<Status> {
	const status = Status.create({
		...data,
	});
	try{
		await status.save();
		return status;
	} catch (err){
		throw new Error(`Error creating status: ${err}`);

	}
}

@Mutation(() => ID)
async updateStatus(
	@Arg("id") id: number,
	@Arg("data") data: UpdateStatusInput
): Promise<number>{
		const status = await Status.findOneByOrFail({id});
    Object.assign(status, data);
		try {
			await status.save();
			return status.id;
		} catch (err) {
			throw new Error(`Error updating status: ${err}`);
		}
	}

	@Mutation(() => ID)
	async deleteStatus(
		@Arg("id") id:number): Promise<number> {
try{
			const status = await Status.findOneBy({ id });
			if(!status) {
				throw new Error("Status not found");
			}
			await Status.delete({id});
				return id; 
			} catch (err) {
				throw new Error(`Failed to delete status: ${err}`);
			}

		}
	}
		
	



 