import { AppError } from "./AppError";

export const Errors = {
    notFound: (entity: string) =>
        new AppError("NOT_FOUND", `${entity} introuvable`),

    alreadyExists: (entity: string) =>
        new AppError("ALREADY_EXISTS", `${entity} existe déjà`),

    unauthorized: () =>
        new AppError("UNAUTHORIZED", "Vous n'êtes pas autorisé"),

    invalidCredentials: () =>
        new AppError("INVALID_CREDENTIALS", "Email ou mot de passe incorrect"),

    notAuthenticated: () =>
        new AppError("NOT_AUTHENTICATED", "Vous devez être connecté pour accéder à cette ressource"),

    mustRegister: () =>
        new AppError("MUST_REGISTER", "Aucun compte trouvé avec cet email, veuillez vous inscrire"),
};