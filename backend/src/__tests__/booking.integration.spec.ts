import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { BookingResolver } from "../resolvers/BookingResolver";
import { BookingService } from "../services/booking.service";
import { customErrorFormatter } from "../errors/customErrorFormatter";


const mockBooking = {
  id: 1,
  bookingRef: 1,
  totalPrice: 20,
  startDate: new Date("2026-06-01"),
  endDate: new Date("2026-06-03"),
  status: { id: 1, statusName: "En attente" },
  user: { id: 1, email: "alice@example.com" },
  bookingsProducts: [],
};

let server: ApolloServer;

const mockGetAllBookings = jest.fn();
const mockGetMyBookings = jest.fn();
const mockCreateBooking = jest.fn();

jest.mock("../services/booking.service", () => ({
  BookingService: jest.fn().mockImplementation(() => ({
    getAllBookings: mockGetAllBookings,
    getMyBookings: mockGetMyBookings,
    createBooking: mockCreateBooking,
    getBookingById: jest.fn(),
    updateBooking: jest.fn(),
    deleteBooking: jest.fn(),
  })),
}));

beforeAll(async () => {
  const schema = await buildSchema({
    resolvers: [BookingResolver],
    validate: true,
  });

  server = new ApolloServer({
    schema,
    formatError: customErrorFormatter,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

function createMockContext(userToken?: any) {
  return {
    contextValue: {
      req: { headers: {} },
      res: { setHeader: jest.fn() },
      ...(userToken ? { user: userToken } : {}),
    },
  };
}


describe("Booking Integration - Create", () => {
  const CREATE_BOOKING_MUTATION = `
    mutation CreateBooking($data: CreateBookingInput!) {
      createBooking(data: $data) {
        id
        startDate
        endDate
      }
    }
  `;

  it("should create a booking successfully when authenticated", async () => {
    mockCreateBooking.mockResolvedValue(mockBooking);

    const ctx = createMockContext({
      id: 1, mail: "alice@example.com", firstName: "Alice", lastName: "Dupont", role: "user",
    });

    const result = await server.executeOperation(
      {
        query: CREATE_BOOKING_MUTATION,
        variables: {
          data: {
            startDate: "2026-06-01T00:00:00.000Z",
            endDate: "2026-06-03T00:00:00.000Z",
          },
        },
      },
      ctx,
    );

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();

      const data = result.body.singleResult.data?.createBooking as any;
      expect(data.id).toBe("1");
    }

    expect(mockCreateBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }),
      1, 
    );
  });

  it("should return NOT_AUTHENTICATED error if user is not logged in", async () => {
    const ctx = createMockContext(); 

    const result = await server.executeOperation(
      {
        query: CREATE_BOOKING_MUTATION,
        variables: {
          data: {
            startDate: "2026-06-01T00:00:00.000Z",
            endDate: "2026-06-03T00:00:00.000Z",
          },
        },
      },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].extensions?.code).toBe("NOT_AUTHENTICATED");
    }

    expect(mockCreateBooking).not.toHaveBeenCalled();
  });
});


describe("Booking Integration - Get My Bookings", () => {
  const GET_MY_BOOKINGS_QUERY = `
    query GetMyBookings {
      getMyBookings {
        id
        bookingRef
      }
    }
  `;

  it("should return only the bookings of the authenticated user", async () => {
    mockGetMyBookings.mockResolvedValue([mockBooking]);

    const ctx = createMockContext({
      id: 1, mail: "alice@example.com", firstName: "Alice", lastName: "Dupont", role: "user",
    });

    const result = await server.executeOperation(
      { query: GET_MY_BOOKINGS_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();

      const data = result.body.singleResult.data?.getMyBookings as any[];
      expect(data).toHaveLength(1);
    }

    expect(mockGetMyBookings).toHaveBeenCalledWith(1);
  });

  it("should return NOT_AUTHENTICATED error if user is not logged in", async () => {
    const ctx = createMockContext();

    const result = await server.executeOperation(
      { query: GET_MY_BOOKINGS_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].extensions?.code).toBe("NOT_AUTHENTICATED");
    }

    expect(mockGetMyBookings).not.toHaveBeenCalled();
  });
});


describe("Booking Integration - Get All Bookings (Admin only)", () => {
  const GET_ALL_BOOKINGS_QUERY = `
    query GetAllBookings {
      getAllBookings {
        id
      }
    }
  `;

  it("should return all bookings when user is admin", async () => {
    mockGetAllBookings.mockResolvedValue([mockBooking]);

    const ctx = createMockContext({
      id: 99, mail: "admin@example.com", firstName: "Admin", lastName: "Boss", role: "admin",
    });

    const result = await server.executeOperation(
      { query: GET_ALL_BOOKINGS_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();

      const data = result.body.singleResult.data?.getAllBookings as any[];
      expect(data).toHaveLength(1);
    }

    expect(mockGetAllBookings).toHaveBeenCalled();
  });

  it("should return UNAUTHORIZED error if user is not admin", async () => {
    const ctx = createMockContext({
      id: 1, mail: "alice@example.com", firstName: "Alice", lastName: "Dupont", role: "user",
    });

    const result = await server.executeOperation(
      { query: GET_ALL_BOOKINGS_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].extensions?.code).toBe("UNAUTHORIZED");
    }

 
    expect(mockGetAllBookings).not.toHaveBeenCalled();
  });

  it("should return NOT_AUTHENTICATED error if user is not logged in", async () => {
    const ctx = createMockContext();

    const result = await server.executeOperation(
      { query: GET_ALL_BOOKINGS_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].extensions?.code).toBe("NOT_AUTHENTICATED");
    }

    expect(mockGetAllBookings).not.toHaveBeenCalled();
  });
});