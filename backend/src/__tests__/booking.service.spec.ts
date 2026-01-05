import { BookingService } from "../services/booking.service";
import { Booking } from "../entities/Booking";
import { StatusService } from "../services/status.service";

jest.mock("../entities/Booking");
jest.mock("../services/status.service");

describe("BookingService", () => {
  let service: BookingService;

  beforeEach(() => {
    service = new BookingService();
    jest.clearAllMocks();
  });

  it("should get all bookings", async () => {
    (Booking.find as jest.Mock).mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]);

    const result = await service.getAllBookings();

    expect(Booking.find).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it("should get booking by id", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue({
      id: 1,
    });

    const result = await service.getBookingById(1);

    expect(result.id).toBe(1);
  });

  it("should throw if booking not found", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getBookingById(99)).rejects.toThrow("Booking not found");
  });

  it("should create a booking with default status", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    (Booking.create as jest.Mock).mockReturnValue({
      save: saveMock,
    });

    (StatusService.prototype.getStatusByName as jest.Mock).mockResolvedValue({
      id: 1,
      statusName: "En attente",
    });

    const result = await service.createBooking({
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
    });

    expect(saveMock).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("should update booking status", async () => {
    const saveMock = jest.fn();

    (Booking.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
      save: saveMock,
    });

    (StatusService.prototype.getStatusById as jest.Mock).mockResolvedValue({
      id: 2,
      statusName: "À préparer",
    });

    const result = await service.updateBooking(1, { statusId: 2 });

    expect(saveMock).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("should delete booking", async () => {
    (Booking.findOneBy as jest.Mock).mockResolvedValue({ id: 1 });
    (Booking.delete as jest.Mock).mockResolvedValue(true);

    const result = await service.deleteBooking(1);

    expect(result).toBe(1);
  });
});
