import { BookingService } from "../services/booking.service";
import { Booking } from "../entities/Booking";
import { Status } from "../entities/Status";

jest.mock("../entities/Booking", () => ({
  Booking: {
    create: jest.fn().mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    })),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../entities/Status", () => ({
  Status: {
    findOne: jest.fn().mockResolvedValue({ id: 1, statusName: "En attente" }),
  },
}));

describe("BookingService", () => {
  let service: BookingService;

  beforeEach(() => {
    service = new BookingService();  
    jest.clearAllMocks();
  });

  it("should get all bookings", async () => {
    (Booking.find as jest.Mock).mockResolvedValueOnce([
      { id: 1, startDate: new Date("2026-01-01"), endDate: new Date("2026-01-05"), status: { id: 1, statusName: "En attente" } },
      { id: 2, startDate: new Date("2026-02-01"), endDate: new Date("2026-02-05"), status: { id: 1, statusName: "En attente" } },
    ]);

    const result = await service.getAllBookings();

    expect(result).toHaveLength(2);
  });

  it("should get booking by id", async () => {
    const bookingMock = { id: 1, startDate: new Date("2026-01-01"), endDate: new Date("2026-01-05"), status: {} };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);

    const result = await service.getBookingById(1);

    expect(result).toEqual(bookingMock);
  });

  it("should throw error if booking not found by id", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.getBookingById(999)).rejects.toThrow("Booking not found");
  });

  it("should create a booking with default status", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      statusName: "En attente",
    });

    const result = await service.createBooking({
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
    });

    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      })
    );

    expect(result).toBeDefined();
  });

  it("should throw error if end date is before start date on create", async () => {
    await expect(
      service.createBooking({
        startDate: new Date("2026-01-05"),
        endDate: new Date("2026-01-01"),
      })
    ).rejects.toThrow("End date must be after start date");
  });

  it("should update a booking", async () => {
    const bookingMock = { id: 1, startDate: new Date("2026-01-01"), endDate: new Date("2026-01-05"), save: jest.fn() };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);

    const data = { startDate: new Date("2026-01-02") };
    const result = await service.updateBooking(1, data);

    expect(bookingMock.save).toHaveBeenCalled();
    expect(result.startDate).toEqual(new Date("2026-01-02"));
  });

  it("should throw error if booking not found on update", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.updateBooking(999, { startDate: new Date("2026-01-01") })).rejects.toThrow("Booking not found");
  });

  it("should update booking status", async () => {
    const bookingMock = { id: 1, startDate: new Date("2026-01-01"), endDate: new Date("2026-01-05"), status: {}, save: jest.fn() };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);

    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 2,
      statusName: "À préparer",
    });

    const result = await service.updateBooking(1, { statusId: 2 });

    expect(bookingMock.save).toHaveBeenCalled();
    expect(result.status).toEqual({ id: 2, statusName: "À préparer" });
  });

  it("should throw error if end date is before start date on update", async () => {
    const bookingMock = {
      id: 1,
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-01-01"),
      status: {},
      save: jest.fn(),
    };

    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);

    await expect(service.updateBooking(1, {})).rejects.toThrow("End date must be after start date");
  });

  it("should delete a booking", async () => {
    (Booking.findOneBy as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (Booking.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.deleteBooking(1);

    expect(result).toBe(1);
  });

  it("should throw error if booking not found on delete", async () => {
    (Booking.findOneBy as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.deleteBooking(999)).rejects.toThrow("Booking not found");
  });
});