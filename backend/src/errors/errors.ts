import { AppError } from "./AppError";

export const Errors = {
    notFound: (entity: string) =>
        new AppError("NOT_FOUND", `${entity} not found`),

    alreadyExists: (entity: string) =>
        new AppError("ALREADY_EXISTS", `${entity} already exists`),
    
    unauthorized: () =>
        new AppError("UNAUTHORIZED", "You are not authorized"),
};