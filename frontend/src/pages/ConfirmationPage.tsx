import { useLocation, useNavigate } from "react-router";

type ConfirmationState = {
  bookingIds:  number[];
  items: {
    productName: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    startDate: string;
    endDate: string;
		image: string; 
  }[];
  total: number;
};

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState;

  if (!state) {
    navigate("/");
    return null;
  }

  const { bookingIds, items, total } = state;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="rounded-2xl bg-[var(--dark-green)] text-white overflow-hidden">
        
        <div className="border-b border-white/20 px-6 py-5 text-center">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-title)] text-[var(--beige)]">
            Réservation confirmée !
          </h1>
          {bookingIds.map((id) => (
          <p key={id} className="text-[var(--light-green)] font-bold mt-2">
            Numéro de réservation : #{id}
          </p>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-4">

          {items.map((item, index) => (
           <div key={index} className="rounded-xl bg-white/10 p-4 flex items-center gap-4">
					 <img
						 src={item.image}
						 alt={item.productName}
						 className="h-16 w-16 object-contain bg-white rounded-lg p-1"
					 />
              <p className="font-bold font-[family-name:var(--font-title)] text-[var(--beige)]">{item.productName}</p>
              <p className="text-xs text-[var(--beige)] mt-1">Couleur {item.color}</p>
							<p className="text-xs text-[var(--beige)] mt-1"> Taille {item.size}</p>
              <p className="text-xs text-[var(--beige)] mt-1">Du {item.startDate} au {item.endDate}</p>
              <p className="text-xs text-[var(--beige)] mt-1">Quantité {item.quantity}</p>
            </div>
          ))}

          <div className="border-t border-white/20 pt-4 flex justify-between items-center">
            <p className="font-bold text-lg">Total payé :</p>
            <p className="font-bold text-[var(--light-green)] text-xl">{total}€</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full rounded-full bg-[var(--beige)] py-4 text-xl font-bold text-[var(--dark-green)] cursor-pointer"
          >
            Retour à l'accueil
          </button>

        </div>
      </div>
    </div>
  );
}