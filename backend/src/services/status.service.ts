import { Status } from "../entities/Status";

export class StatusService {
  private get statusRepository() {
    return Status.getRepository();
  }

  get findAll() {
    return async (): Promise<Status[]> => {
      return this.statusRepository.find();
    };
  }

  get findById() {
    return async (id: number): Promise<Status | null> => {
      return this.statusRepository.findOne({ where: { id } });
    };
  }

  get createStatus() {
    return async (statusName: string): Promise<Status> => {
      const status = this.statusRepository.create({ statusName });
      return status.save();
    };
  }

  get updateStatus() {
    return async (id: number, statusName: string): Promise<Status | null> => {
      const status = await this.statusRepository.findOne({ where: { id } });
      if (!status) return null;

      status.statusName = statusName;
      return status.save();
    };
  }

  get deleteStatus() {
    return async (id: number): Promise<boolean> => {
      const result = await this.statusRepository.delete(id);
      return result.affected !== 0; 
    };
  }
}