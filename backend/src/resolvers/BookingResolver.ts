import {
  Arg,
  Field,
  InputType,
	ID,
  Mutation,
  Resolver,
	Query,
} from "type-graphql";

import {Booking} from "../entities/Booking";

@InputType()
class CreateBookingInput{
	@Field()
	bookingRef!:number;

	@Field()
	totalPrice!:number;

	@Field()
	startDate!:Date;

	@Field()
	endDate!:Date;
}

@InputType()
class UpdateBookingInput{
	@Field({ nullable: true })
	bookingRef!:number;

  @Field({ nullable: true })
	totalPrice!:number;

	@Field({ nullable: true })
	startDate!:Date;

  @Field({ nullable: true })
	endDate!:Date;
}



@Resolver(Booking)
export class BookingResolver {
  
	@Query (() => [Booking])
	async getAllBookings(): Promise<Booking[]> {
		try{
			const bookings = await Booking.find({
				// relations: { status: true, bookingsProducts: true }
			});
			return bookings;
		} catch (err) {
throw new Error (`Error fetching bookings: ${err}`);
		}
	}

	@Query (() => Booking)
	async getBookingById(
    @Arg("id", () => ID) id: number
  ): Promise<Booking | null> {
    try {
      const booking = await Booking.findOne({ where: { id } });
      return booking;
    } catch (err) {
      throw new Error(`Error fetching booking with id ${id}: ${err}`);
    }
  }
	
	@Mutation(() => Booking)
  async createBooking(
    @Arg("data") data: CreateBookingInput
  ): Promise<Booking> {
		const booking = Booking.create({
			...data,
		})

    if (booking.endDate <= booking.startDate) {
      throw new Error("endDate has to be after startDate");
    }

    try {
      await booking.save();
      return booking;
    } catch (err) {
      throw new Error(`Error creating booking : ${err}`);
    }
  }

	@Mutation(() => ID)
async updateBooking(
  @Arg("id") id: number,
  @Arg("data") data: UpdateBookingInput
): Promise<number> {
  try {
  let booking = await Booking.findOneByOrFail({ id });

  booking = Object.assign(booking, data);

  if (booking.startDate && booking.endDate && booking.endDate <= booking.startDate) {
    throw new Error("endDate must be after startDate");
  }
  await booking.save();

  return booking.id;
} catch (err) {
	throw new Error(`Error updating booking: ${err}`);
}
}

	@Mutation(()=> ID)
	async deleteBooking(@Arg("id") id: number): Promise<number> {
		try{
			const booking = await Booking.findOneBy({ id });
			if(!booking) {
				throw new Error("Booking not found");
			}
			await Booking.delete({id});
				return id; 
			} catch (err) {
				throw new Error(`Error deleting booking: ${err}`);
			}

		}
	}
