import { Status } from "../entities/Status";

const DEFAULT_STATUSES = [
  "En attente",
  "À préparer",
  "En cours",
  "Terminée",
  "Annulée",
];

export async function seedStatuses(): Promise<void> {
  for (const statusName of DEFAULT_STATUSES) {
    const exists = await Status.findOne({ where: { statusName } });

    if (!exists) {
      const status = Status.create({ statusName });
      await status.save();
      console.log(`✅ Status créé : ${statusName}`);
    }
  }
}