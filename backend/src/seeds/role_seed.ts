import { Role } from "../entities/Role";

const DEFAULT_ROLES = ["user", "admin", "manager"];

export async function seedRoles(): Promise<void> {
    for (const roleName of DEFAULT_ROLES) {
        const exists = await Role.findOne({ where: { roleName } });

        if (!exists) {
            const role = Role.create({ roleName });
            await role.save();
            console.log(`Role created: ${roleName}`);
        }
    }
}
