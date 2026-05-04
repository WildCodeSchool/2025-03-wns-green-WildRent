import { StatusInput } from "../dtos/status.dto";
import { Status } from "../entities/Status";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing booking statuses (e.g., Pending, To prepare, Completed).
 * Handles CRUD operations and lookup by name.
 */
export class StatusService {
  /**
   * Retrieves all available statuses.
   * @returns Array of all statuses
   */
  async getAllStatus(): Promise<Status[]> {
    return Status.find();
  }

  /**
   * Retrieves a single status by its ID.
   * @param id - The status ID
   * @returns The matching status
   * @throws NotFoundError if no status exists with the given ID
   */
  async getStatusById(id: number): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) throw Errors.notFound("Status");
    return status;
  }

  /**
   * Retrieves a single status by its name.
   * @param name - The status name to search for
   * @returns The matching status
   * @throws NotFoundError if no status exists with the given name
   */
  async getStatusByName(name: string): Promise<Status> {
    const status = await Status.findOne({ where: { statusName: name } });
    if (!status) throw Errors.notFound("Status");
    return status;
  }

  /**
   * Creates a new status.
   * @param data - The status input containing the status name
   * @returns The newly created status
   */
  async createStatus(data: StatusInput): Promise<Status> {
    const status = Status.create({ statusName: data.statusName });
    await status.save();
    return status;
  }

  /**
   * Updates an existing status's name.
   * @param id - The status ID to update
   * @param data - The new status data containing the status name
   * @returns The updated status
   * @throws NotFoundError if the status does not exist
   */
  async updateStatus(id: number, data: StatusInput): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) throw Errors.notFound("Status");

    status.statusName = data.statusName;
    await status.save();
    return status;
  }

  /**
   * Deletes a status by its ID.
   * @param id - The status ID to delete
   * @returns The deleted status entity
   * @throws NotFoundError if the status does not exist
   */
  async deleteStatus(id: number): Promise<Status> {
    const status = await Status.findOne({ where: { id } });
    if (!status) throw Errors.notFound("Status");

    await Status.remove(status);
    return status;
  }
}
