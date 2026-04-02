import { StatusService } from "../services/status.service";
import { Status } from "../entities/Status";


jest.mock("../entities/Status", () => ({
  Status: {
    create: jest.fn().mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    })),
    findOne: jest.fn().mockResolvedValue(null),
    remove: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockResolvedValue([]),
  },
}));

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

  it("should throw error if status not found by ID", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.getStatusById(999)).rejects.toThrow("Status not found");
  });

  it("should get status by name", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      statusName: "En attente",
    });

    const result = await service.getStatusByName("En attente");

    expect(result.statusName).toBe("En attente");
  });


  it("should create a new status", async () => {
    const result = await service.createStatus({ statusName: "En attente" });

    expect(Status.create).toHaveBeenCalledWith({ statusName: "En attente" });
    expect(result).toBeDefined();
  });

  it("should update a status", async () => {
    const statusMock = { id: 1, statusName: "En attente", save: jest.fn() };
    (Status.findOne as jest.Mock).mockResolvedValueOnce(statusMock);

    const result = await service.updateStatus(1, { statusName: "Disponible" });

    expect(statusMock.save).toHaveBeenCalled();
    expect(result.statusName).toBe("Disponible");
  });

  it("should throw error if status not found on update", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.updateStatus(999, { statusName: "x" })).rejects.toThrow(
      "Status not found"
    );
  });

  it("should delete a status", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      statusName: "En attente",
    });
    (Status.remove as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.deleteStatus(1);

    expect(result).toBeDefined();
  });

  it("should throw error if status not found on delete", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.deleteStatus(999)).rejects.toThrow("Status not found");
  });
});