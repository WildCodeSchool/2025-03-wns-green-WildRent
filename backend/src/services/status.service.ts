import { Status } from "../entities/Status";

export class StatusService {
  async getAllStatus(): Promise<Status[]> {
    return Status.find();
  }

  async getStatusById(id: number): Promise<Status | null> {
    return Status.findOne({ where: { id } });
  }

  async createStatus(statusName: string): Promise<Status> {
    const status = Status.create({ statusName });
    await status.save();
    return status;
}

  async updateStatus(id: number, statusName: string): Promise<Status> {
    const status = await Status.findOneByOrFail({ id });
		status.statusName = statusName;
    await status.save();
    return status;
  }

  async deleteStatus(id: number): Promise<number> {
    const status = await Status.findOneBy({ id });
    if (!status) throw new Error("Status not found");
    await Status.delete({ id });
    return id;
  }
}