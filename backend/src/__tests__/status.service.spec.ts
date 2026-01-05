import { StatusService } from "../services/status.service";
import { Status } from "../entities/Status";

jest.mock("../entities/Status");

describe("StatusService", () => {
  let service: StatusService;

  beforeEach(() => {
    service = new StatusService();
    jest.clearAllMocks();
  });

  it("should create a new status", async () => {
    (Status.create as jest.Mock).mockReturnValue({
      save: jest.fn().mockResolvedValue(true),
      statusName: "En attente",
    });

    const result = await service.createStatus({ statusName: "En attente" });

    expect(Status.create).toHaveBeenCalledWith({ statusName: "En attente" });
    expect(result.statusName).toBe("En attente");
  });

  it("should return a status by ID", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      statusName: "À préparer",
    });

    const result = await service.getStatusById(1);

    expect(result.statusName).toBe("À préparer");
  });

  it("should throw if status by ID not found", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getStatusById(1)).rejects.toThrow("Status not found");
  });

  it("should return a status by name", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 2,
      statusName: "En attente",
    });

    const result = await service.getStatusByName("En attente");
    expect(result.statusName).toBe("En attente");
  });

  it("should throw if status name does not exist", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getStatusByName("En attente"))
      .rejects
      .toThrow("Status 'En attente' not found");
  });

  it("should update a status", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 3,
      statusName: "Ancien nom",
      save: saveMock,
    });

    const updated = await service.updateStatus(3, { statusName: "Nouveau nom" });

    expect(updated.statusName).toBe("Nouveau nom");
    expect(saveMock).toHaveBeenCalled();
  });

  it("should delete a status", async () => {
    const removeMock = jest.fn().mockResolvedValue(true);

    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 5,
      statusName: "À supprimer",
      remove: removeMock,
    });

    const result = await service.deleteStatus(5);

    expect(result.statusName).toBe("À supprimer");
    expect(removeMock).toHaveBeenCalled();
  });

  it("should throw if delete target not found", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.deleteStatus(99))
      .rejects
      .toThrow("Status not found");
  });
});
