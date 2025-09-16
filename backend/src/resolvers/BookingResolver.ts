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
	totalPrice!:number;

	@Field()
	startDate!:Date;

	@Field()
	endDate!:Date;
}

@InputType()
class UpdateBookingInput{

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
throw new Error (`Erreur lors de la récupération des réservations: ${err}`);
		}
	}

	@Query (() => Booking, { nullable: true })
	async getBookingById(
    @Arg("id", () => ID) id: number
  ): Promise<Booking | null> {
    try {
      const booking = await Booking.findOne({ where: { id } });
      return booking;
    } catch (err) {
      throw new Error(`Erreur lors de la récupération de la réservation ${id}: ${err}`);
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
      throw new Error("La date de fin doit être postérieure à la date de début");
    }

    try {
      await booking.save();
      return booking;
    } catch (err) {
      throw new Error(`Erreur lors de la création de la réservation : ${err}`);
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

	if (booking.startDate && booking.endDate) {
		if (booking.endDate <= booking.startDate) {
    throw new Error("La date de fin doit être postérieure à la date de début");
  }
}
  await booking.save();

  return booking.id;
} catch (err) {
	throw new Error(`Erreur lors de la modification de la réservation: ${err}`);
}
}

	@Mutation(()=> ID)
	async deleteBooking(@Arg("id") id: number): Promise<number> {
		try{
			const booking = await Booking.findOneBy({ id });
			if(!booking) {
				throw new Error("Réservation introuvable");
			}
			await Booking.delete({id});
				return id; 
			} catch (err) {
				throw new Error(`Erreur lors de la suppression de la réservation: ${err}`);
			}

		}
	}
