import { BookingService } from "../services/booking.service";
import { Booking } from "../entities/Booking";
import { Status } from "../entities/Status";
import { User } from "../entities/User";

jest.mock("../entities/Booking", () => ({
  Booking: {
    create: jest.fn().mockImplementation((data: unknown) => ({
      ...data as object,
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
    findOne: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("../entities/User", () => ({
  User: {
    findOne: jest.fn().mockResolvedValue({ id: 1, email: "test@test.com" }),
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

    await expect(service.getBookingById(999)).rejects.toThrow("Booking introuvable");
  });

  it("should get user bookings excluding cart (En attente)", async () => {
    (Status.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, statusName: "En attente" });
    (Booking.find as jest.Mock).mockResolvedValueOnce([
      { id: 2, status: { id: 2, statusName: "À préparer" } },
    ]);

    const result = await service.getMyBookings(1);

    expect(result).toHaveLength(1);
    expect(result[0].status.statusName).toBe("À préparer");
  });

  it("should create a booking with default status and user", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, email: "test@test.com" });
    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      statusName: "En attente",
    });

    const result = await service.createBooking(
      {
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-01-05"),
      },
      1,
    );

    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        user: expect.objectContaining({ id: 1 }),
      })
    );

    expect(result).toBeDefined();
  });

  it("should allow same-day booking (start === end)", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, email: "test@test.com" });
    (Status.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, statusName: "En attente" });

    const sameDate = new Date("2026-05-04");

    const result = await service.createBooking(
      { startDate: sameDate, endDate: sameDate },
      1,
    );

    expect(result).toBeDefined();
  });

  it("should throw error if user not found on create", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.createBooking(
        {
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-01-05"),
        },
        999,
      )
    ).rejects.toThrow("User introuvable");
  });

  it("should throw error if end date is before start date on create", async () => {
    await expect(
      service.createBooking(
        {
          startDate: new Date("2026-01-05"),
          endDate: new Date("2026-01-01"),
        },
        1,
      )
    ).rejects.toThrow("La date de fin ne peut pas être avant la date de début");
  });

  it("should update a booking", async () => {
    const bookingMock = {
      id: 1,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
      status: { id: 2, statusName: "À préparer" },
      user: { id: 1 },
      save: jest.fn(),
    };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);

    const data = { startDate: new Date("2026-01-02") };
    const result = await service.updateBooking(1, data, 1);

    expect(bookingMock.save).toHaveBeenCalled();
    expect(result.startDate).toEqual(new Date("2026-01-02"));
  });

  it("should throw error if booking not found on update", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.updateBooking(999, { startDate: new Date("2026-01-01") }, 1)
    ).rejects.toThrow("Booking introuvable");
  });

  it("should throw error if user does not own the booking", async () => {
    const bookingMock = {
      id: 1,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
      status: { id: 1, statusName: "En attente" },
      user: { id: 2 },
      save: jest.fn(),
    };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);

    await expect(
      service.updateBooking(1, { startDate: new Date("2026-01-02") }, 1)
    ).rejects.toThrow();
  });

  it("should throw error if booking is not 'À préparer' on update", async () => {
    const bookingMock = {
      id: 1,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
      status: { id: 3, statusName: "En cours" },  
      user: { id: 1 },
      save: jest.fn(),
    };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);
  
    await expect(
      service.updateBooking(1, { startDate: new Date("2026-01-02") }, 1)
    ).rejects.toThrow("Seules les réservations à préparer peuvent être modifiées");  
  });

  it("should update booking status", async () => {
    const bookingMock = {
      id: 1,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-05"),
      status: { id: 2, statusName: "À préparer" },  
      user: { id: 1 },
      save: jest.fn(),
    };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);
  
    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 5,
      statusName: "Annulée",
    });
  
    const result = await service.updateBooking(1, { statusId: 5 }, 1);
  
    expect(bookingMock.save).toHaveBeenCalled();
    expect(result.status).toEqual({ id: 5, statusName: "Annulée" });
  });

  it("should delete a booking", async () => {
    (Booking.findOneBy as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (Booking.delete as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.deleteBooking(1);

    expect(result).toBe(1);
  });

  it("should throw error if booking not found on delete", async () => {
    (Booking.findOneBy as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.deleteBooking(999)).rejects.toThrow("Booking introuvable");
  });

  it("should transition a booking to a new status", async () => {
    const bookingMock = {
      id: 1,
      status: { id: 1, statusName: "En attente" },
      user: { id: 1 },
      save: jest.fn(),
    };
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(bookingMock);
    (Status.findOne as jest.Mock).mockResolvedValueOnce({
      id: 2,
      statusName: "À préparer",
    });

    const result = await service.transitionStatus(1, 2);

    expect(bookingMock.save).toHaveBeenCalled();
    expect(result.status).toEqual({ id: 2, statusName: "À préparer" });
  });

  it("should throw error if booking not found on transitionStatus", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.transitionStatus(999, 2)).rejects.toThrow("Booking introuvable");
  });

  it("should throw error if status not found on transitionStatus", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      status: { id: 1, statusName: "En attente" },
    });
    (Status.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.transitionStatus(1, 999)).rejects.toThrow("Status introuvable");
  });
});
