import argon2 from "argon2";
import { Booking } from "../entities/Booking";
import { BookingProducts } from "../entities/BookingProducts";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { Role } from "../entities/Role";
import { Status } from "../entities/Status";
import { User } from "../entities/User";
import { generateProductRef } from "../utils/generateProductRef";

export async function seedDatabase() {
    const existingCategories = await Category.count();
    if (existingCategories > 0) return;

    console.log("Seeding database");

    // --- Roles (créés au démarrage par seedRoles dans index.ts) ---
    const adminRole = await Role.findOneBy({ roleName: "admin" });
    const userRole = await Role.findOneBy({ roleName: "user" });

    if (!adminRole || !userRole) {
        console.log("Roles not found, skipping seed.");
        return;
    }

    // --- Users ---
    const hashedPassword = await argon2.hash("Test1234!");

    const admin = User.create({
        firstname: "Admin",
        lastname: "WildRent",
        phoneNumber: "0600000000",
        email: "admin@wildrent.fr",
        password: hashedPassword,
        address: "10 rue de la Location",
        city: "Paris",
        postalCode: "75001",
        role: adminRole,
    });

    const user = User.create({
        firstname: "Jean",
        lastname: "Dupont",
        phoneNumber: "0612345678",
        email: "jean@test.fr",
        password: hashedPassword,
        address: "5 avenue des Sports",
        city: "Lyon",
        postalCode: "69001",
        role: userRole,
    });

    await User.save([admin, user]);

    // --- Categories ---
    const outdoor = Category.create({ name: "Activités outdoor", image: "/images/Cat activités outdoor.png" });
    const camping = Category.create({ name: "Camping", image: "/images/Cat camping.png" });
    const escalade = Category.create({ name: "Escalade", image: "/images/Cat escalade.png" });
    const randonnee = Category.create({ name: "Randonnée", image: "/images/Cat randonnée.png" });
    const aquatique = Category.create({ name: "Aquatique", image: "/images/Cat sports aquatique.png" });
    const hiver = Category.create({ name: "Sports d'hiver", image: "/images/Cat sports d'hiver.png" });

    await Category.save([outdoor, camping, escalade, randonnee, aquatique, hiver]);

    // --- Products ---
    const products = [
        Product.create({
            name: "Ski Alpin",
            price: 45,
            description: "Paire de skis alpins polyvalents pour piste et hors-piste, fixations réglables incluses.",
            image: "/images/ski.png",
            productRef: generateProductRef(),
            brand: "Rossignol",
            gender: "Mixte",
            category: hiver,
        }),
        Product.create({
            name: "Snowboard Freestyle",
            price: 40,
            discount: 20,
            description: "Snowboard freestyle twin-tip idéal pour le park et les figures, flex medium.",
            image: "/images/Snowboard1.png",
            image1: "/images/Snowboard2.png",
            image2: "/images/Snowboard3.png",
            productRef: generateProductRef(),
            brand: "Burton",
            gender: "Mixte",
            category: hiver,
        }),
        Product.create({
            name: "Snowboard Freeride",
            price: 50,
            description: "Snowboard freeride directionnel pour poudreuse et descente engagée, flex rigide.",
            image: "/images/Snowboard2.png",
            image1: "/images/Snowboard1.png",
            image2: "/images/Snowboard3.png",
            productRef: generateProductRef(),
            brand: "Jones",
            gender: "Homme",
            category: hiver,
        }),
        Product.create({
            name: "Snowboard Débutant",
            price: 30,
            description: "Snowboard souple et tolérant, parfait pour l'apprentissage et la progression sur piste.",
            image: "/images/Snowboard3.png",
            image1: "/images/Snowboard1.png",
            productRef: generateProductRef(),
            brand: "Nitro",
            gender: "Mixte",
            category: hiver,
        }),
        Product.create({
            name: "Boots de Ski",
            price: 25,
            discount: 15,
            description: "Chaussures de ski alpin avec serrage micrométrique et chausson thermoformable.",
            image: "/images/boot1.png",
            image1: "/images/boot2.png",
            productRef: generateProductRef(),
            brand: "Salomon",
            gender: "Homme",
            category: hiver,
        }),
        Product.create({
            name: "Boots de Ski Femme",
            price: 25,
            description: "Chaussures de ski confortables avec flex adapté et chausson isolant.",
            image: "/images/boot2.png",
            image1: "/images/boot1.png",
            productRef: generateProductRef(),
            brand: "Rossignol",
            gender: "Femme",
            category: hiver,
        }),
        Product.create({
            name: "Boots de Neige",
            price: 18,
            description: "Boots chaudes et imperméables pour la neige, semelle antidérapante et confort thermique.",
            image: "/images/snow2.png",
            image1: "/images/snow1.png",
            productRef: generateProductRef(),
            brand: "Columbia",
            gender: "Mixte",
            category: hiver,
        }),
        Product.create({
            name: "Après-Ski",
            price: 15,
            description: "Bottes après-ski fourrées et légères pour le confort en station.",
            image: "/images/snow1.png",
            image1: "/images/snow2.png",
            productRef: generateProductRef(),
            brand: "Moon Boot",
            gender: "Femme",
            category: hiver,
        }),
        Product.create({
            name: "Bâtons de Ski",
            price: 10,
            description: "Paire de bâtons de ski en aluminium léger avec dragonnes réglables.",
            image: "/images/baton.png",
            productRef: generateProductRef(),
            brand: "Leki",
            gender: "Mixte",
            category: hiver,
        }),

        Product.create({
            name: "Chaussures Trail",
            price: 22,
            discount: 30,
            description: "Chaussures de randonnée montantes Gore-Tex avec semelle Vibram pour adhérence optimale.",
            image: "/images/boot1.png",
            image1: "/images/boot2.png",
            productRef: generateProductRef(),
            brand: "Salomon",
            gender: "Homme",
            category: randonnee,
        }),
        Product.create({
            name: "Chaussures Rando",
            price: 20,
            description: "Chaussures de randonnée légères et respirantes pour sentiers et chemins.",
            image: "/images/boot2.png",
            image1: "/images/boot1.png",
            productRef: generateProductRef(),
            brand: "Merrell",
            gender: "Femme",
            category: randonnee,
        }),
        Product.create({
            name: "Bâtons de Rando",
            price: 8,
            description: "Paire de bâtons de randonnée télescopiques en aluminium avec poignées en liège.",
            image: "/images/baton.png",
            productRef: generateProductRef(),
            brand: "Black Diamond",
            gender: "Mixte",
            category: randonnee,
        }),

        Product.create({
            name: "Ski de Fond",
            price: 35,
            description: "Paire de skis de fond classiques pour balades en forêt et sur pistes damées.",
            image: "/images/ski.png",
            image1: "/images/baton.png",
            productRef: generateProductRef(),
            brand: "Fischer",
            gender: "Mixte",
            category: outdoor,
        }),
        Product.create({
            name: "Splitboard",
            price: 55,
            discount: 10,
            description: "Snowboard splitboard pour la randonnée en montagne et descente freeride.",
            image: "/images/Snowboard3.png",
            image1: "/images/Snowboard1.png",
            image2: "/images/Snowboard2.png",
            productRef: generateProductRef(),
            brand: "Jones",
            gender: "Mixte",
            category: outdoor,
        }),

        Product.create({
            name: "Chaussons Escalade",
            price: 14,
            description: "Chaussons d'escalade à velcro avec gomme haute adhérence pour bloc et voie.",
            image: "/images/boot2.png",
            image1: "/images/boot1.png",
            productRef: generateProductRef(),
            brand: "Scarpa",
            gender: "Mixte",
            category: escalade,
        }),
        Product.create({
            name: "Chaussures Approche",
            price: 16,
            description: "Chaussures d'approche polyvalentes pour marche et escalade en terrain rocheux.",
            image: "/images/boot1.png",
            image1: "/images/boot2.png",
            productRef: generateProductRef(),
            brand: "La Sportiva",
            gender: "Homme",
            category: escalade,
        }),

        Product.create({
            name: "Boots Bivouac",
            price: 20,
            description: "Boots isolantes et légères pour le campement en altitude et bivouac.",
            image: "/images/snow1.png",
            image1: "/images/snow2.png",
            productRef: generateProductRef(),
            brand: "Deuter",
            gender: "Mixte",
            category: camping,
        }),
        Product.create({
            name: "Bâtons Trekking",
            price: 12,
            description: "Bâtons de trekking pliables ultra-légers en carbone pour longues randonnées et camping.",
            image: "/images/baton.png",
            productRef: generateProductRef(),
            brand: "Black Diamond",
            gender: "Mixte",
            category: camping,
        }),

        Product.create({
            name: "Bottines Néoprène",
            price: 15,
            discount: 25,
            description: "Bottines en néoprène 3mm pour sports nautiques et activités aquatiques.",
            image: "/images/snow2.png",
            image1: "/images/snow1.png",
            productRef: generateProductRef(),
            brand: "Cressi",
            gender: "Mixte",
            category: aquatique,
        }),
        Product.create({
            name: "Chaussures Aqua",
            price: 10,
            description: "Chaussures aquatiques légères à séchage rapide pour kayak et paddle.",
            image: "/images/boot2.png",
            image1: "/images/boot1.png",
            productRef: generateProductRef(),
            brand: "Mares",
            gender: "Mixte",
            category: aquatique,
        }),
    ];

    await Product.save(products);

    // --- Product Variants ---
    const variants: Partial<ProductVariant>[] = [];

    for (const product of products) {
        const sizes = ["S", "M", "L", "XL"];
        const colors = ["Noir", "Bleu", "Rouge", "Vert", "Gris"];

        const numVariants = 2 + Math.floor(Math.random() * 3);
        const usedCombos = new Set<string>();

        for (let i = 0; i < numVariants; i++) {
            let size: string, color: string;
            do {
                size = sizes[Math.floor(Math.random() * sizes.length)];
                color = colors[Math.floor(Math.random() * colors.length)];
            } while (usedCombos.has(`${size}-${color}`));
            usedCombos.add(`${size}-${color}`);

            // ~15% des variants ont une réduction spécifique (écoulement de stock)
            const variantDiscount = Math.random() < 0.15 ? [10, 15, 25, 30, 40][Math.floor(Math.random() * 5)] : 0;

            variants.push({
                color,
                size,
                quantity: 1 + Math.floor(Math.random() * 10),
                discount: variantDiscount,
                productRef: generateProductRef(),
                product,
            });
        }
    }

    // --- Variants fixes pour tester la logique de réduction ---
    // Règle : variant.discount = 0 (hérite du produit) OU >= product.discount (déstockage)

    // Cas 1 : product=20%, variant=40% → affiche 40% sur détail
    variants.push({
        color: "Rouge",
        size: "M",
        quantity: 3,
        discount: 40,
        productRef: generateProductRef(),
        product: products[1], // Snowboard Freestyle (discount produit = 20%)
    });

    // Cas 2 : product=20%, variant=0% → hérite du produit, affiche 20% sur détail
    variants.push({
        color: "Noir",
        size: "XL",
        quantity: 2,
        discount: 0,
        productRef: generateProductRef(),
        product: products[1], // Snowboard Freestyle (discount produit = 20%)
    });

    // Cas 3 : product=0%, variant=35% → affiche 0% sur carte, 35% sur détail
    variants.push({
        color: "Bleu",
        size: "L",
        quantity: 1,
        discount: 35,
        productRef: generateProductRef(),
        product: products[2], // Snowboard Freeride (discount produit = 0%)
    });

    // Cas 4 : product=15%, variant=50% → affiche 15% sur carte, 50% sur détail
    variants.push({
        color: "Vert",
        size: "S",
        quantity: 4,
        discount: 50,
        productRef: generateProductRef(),
        product: products[4], // Boots de Ski (discount produit = 15%)
    });

    // Cas 5 : product=30%, variant=45% → affiche 30% sur carte, 45% sur détail
    variants.push({
        color: "Gris",
        size: "L",
        quantity: 2,
        discount: 45,
        productRef: generateProductRef(),
        product: products[9], // Chaussures Trail (discount produit = 30%)
    });

    // Cas 6 : product=25%, variant=60% → affiche 25% sur carte, 60% sur détail (déstockage)
    variants.push({
        color: "Rouge",
        size: "S",
        quantity: 1,
        discount: 60,
        productRef: generateProductRef(),
        product: products[18], // Bottines Néoprène (discount produit = 25%)
    });

    await ProductVariant.save(variants as ProductVariant[]);

    // --- Mise à jour quantityVariants sur chaque produit ---
    for (const product of products) {
        const productVariants = (variants as ProductVariant[]).filter(
            (v) => v.product.id === product.id
        );
        const total = productVariants.reduce((sum, v) => sum + v.quantity, 0);
        product.quantityVariants = total;
    }
    await Product.save(products);

    // --- Statuses (créés au démarrage par seedStatuses dans index.ts) ---
    const statusEnAttente = await Status.findOneBy({ statusName: "En attente" });
    const statusEnCours = await Status.findOneBy({ statusName: "En cours" });
    const statusTerminee = await Status.findOneBy({ statusName: "Terminée" });

    if (!statusEnAttente || !statusEnCours || !statusTerminee) {
        console.log("Statuses not found, skipping bookings seed.");
        return;
    }

    // --- Bookings ---
    const savedVariants = await ProductVariant.find({ relations: { product: true } });

    const booking1 = Booking.create({
        totalPrice: 95,
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-06-07"),
        status: statusEnCours,
        user: user,
    });

    const booking2 = Booking.create({
        totalPrice: 40,
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-15"),
        status: statusEnAttente,
        user: user,
    });

    const booking3 = Booking.create({
        totalPrice: 70,
        startDate: new Date("2026-05-15"),
        endDate: new Date("2026-05-20"),
        status: statusTerminee,
        user: admin,
    });

    await Booking.save([booking1, booking2, booking3]);

    // --- BookingProducts ---
    const bp1 = BookingProducts.create({
        productQuantity: 1,
        booking: booking1,
        productVariant: savedVariants[0],
    });

    const bp2 = BookingProducts.create({
        productQuantity: 2,
        booking: booking1,
        productVariant: savedVariants[3],
    });

    const bp3 = BookingProducts.create({
        productQuantity: 1,
        booking: booking2,
        productVariant: savedVariants[5],
    });

    const bp4 = BookingProducts.create({
        productQuantity: 1,
        booking: booking3,
        productVariant: savedVariants[1],
    });

    await BookingProducts.save([bp1, bp2, bp3, bp4]);

    console.log(`Seed complete: ${products.length} products, ${variants.length} variants, 3 bookings, 5 statuses.`);
}
