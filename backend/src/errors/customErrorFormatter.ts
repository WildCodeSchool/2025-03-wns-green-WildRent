import { unwrapResolverError } from "@apollo/server/errors";
import { AppError } from "./AppError";
import { ArgumentValidationError } from "type-graphql";
import { GraphQLFormattedError } from "graphql";

export function customErrorFormatter(formattedError:GraphQLFormattedError, error: unknown) {
    const original = unwrapResolverError(error);

    if (original instanceof AppError) {
        return {
            message: original.message,
            extensions: {
                code: original.codeError,
            },
        };
    }

    if (original instanceof Error && original.message === "Argument Validation Error") {
        const validationErrors = (original as ArgumentValidationError).extensions?.validationErrors || [];
        return {
            message: "Erreur de validation",
            extensions: {
                code: "BAD_USER_INPUT",
                fields: validationErrors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            },
        };
    }

    return {
        message: "Internal server error",
        extensions: {
            code: "INTERNAL_SERVER_ERROR",
        },
    };    
}
