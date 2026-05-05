import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { dataSource } from "./db";
import { seedRoles } from "../seeds/role_seed";
import { seedStatuses } from "../seeds/status_seed";
import { seedDatabase } from "./seed";

async function run() {
    await dataSource.initialize();
    await seedRoles();
    await seedStatuses();
    await seedDatabase();
    await dataSource.destroy();
    console.log("Done.");
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
