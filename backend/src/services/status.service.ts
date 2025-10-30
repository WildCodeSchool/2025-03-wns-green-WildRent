import { Status } from "../entities/Status";

export class StatusService {
  async getAllStatus(): Promise<Status[]> {
    return Status.find();
  }

  async getStatusById(id: number): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) {
      throw new Error("Status not found");
    }
    return status;
  }

  async createStatus(statusName: string): Promise<Status> {
    const status = Status.create({ statusName });
    await status.save();
    return status;
  }

  async updateStatus(id: number, statusName: string): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) {
      throw new Error("status not found");
    }
    status.statusName = statusName;
    await status.save();
    return status;
  }

}