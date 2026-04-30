import { StatusInput } from "../dtos/status.dto";
import { Status } from "../entities/Status";

export class StatusService {
  async getAllStatus(): Promise<Status[]> {
    return Status.find();
  }

  async getStatusById(id: number): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) throw new Error("Status not found");
    return status;
  }

  async getStatusByName(name: string): Promise<Status> {
    const status = await Status.findOne({ where: { statusName: name } });
    if (!status) throw new Error(`Status '${name}' not found`);
    return status;
  }

  async createStatus(data: StatusInput): Promise<Status> {
    const status = Status.create({ statusName: data.statusName });
    await status.save();
    return status;
  }

  async updateStatus(id: number, data: StatusInput): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) {
      throw new Error("Status not found");
    }
    status.statusName = data.statusName;
    await status.save();
    return status;
  }

  async deleteStatus(id: number): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) throw new Error("Status not found");
    
    await Status.remove(status);
    return status;
}

}