import { StatusService } from "../services/status.service";
import { Status } from "../entities/Status";

jest.mock("../entities/Status");

describe("StatusService", () => {
  let service: StatusService;

  beforeEach(() => {
    service = new StatusService();
    jest.clearAllMocks();
  });

  it("should get all status", async () => {
    (Status.find as jest.Mock).mockResolvedValue([
      { id: 1, statusName: "En attente" },
      { id: 2, statusName: "À préparer" },
    ]);

    const result = await service.getAllStatus();

    expect(result).toHaveLength(2);
  });

  it("should get status by ID", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      statusName: "En attente",
    });

    const result = await service.getStatusById(1);

    expect(Status.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result.statusName).toBe("En attente");
  });

  it("should throw if status not found", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getStatusById(999)).rejects.toThrow("Status not found");
  });

  it("should create a new status", async () => {
    (Status.create as jest.Mock).mockReturnValue({
      statusName: "En attente",
      save: jest.fn().mockResolvedValue(true),
    });

    const res = await service.createStatus({ statusName: "En attente" });

    expect(Status.create).toHaveBeenCalledWith({ statusName: "En attente" });
    expect(res.statusName).toBe("En attente");
  });

  it("should update a status", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      statusName: "En attente",
      save: jest.fn().mockResolvedValue(true),
    });

    const updated = await service.updateStatus(1, { statusName: "Disponible" });

    expect(updated.statusName).toBe("Disponible");
  });

  it("should delete a status", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      statusName: "En attente",
    });
    (Status.remove as jest.Mock).mockResolvedValue(true);

    const deleted = await service.deleteStatus(1);

    expect(Status.remove).toHaveBeenCalled();
    expect(deleted.statusName).toBe("En attente");
  });

  it("should throw if delete target not found", async () => {
    (Status.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.deleteStatus(999)).rejects.toThrow("Status not found");
  });
});
