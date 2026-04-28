import { AppError } from "./AppError";

export const Errors = {
    notFound: (entity: string) =>
        new AppError("NOT_FOUND", `${entity} introuvable`),

    alreadyExists: (entity: string) =>
        new AppError("ALREADY_EXISTS", `${entity} existe déjà`),

    unauthorized: () =>
        new AppError("UNAUTHORIZED", "Vous n'êtes pas autorisé"),
};