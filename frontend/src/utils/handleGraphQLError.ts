import { toast } from "react-toastify";

type GraphQLFieldError = {
  constraints?: Record<string, string>;
};

type GraphQLError = {
  message: string;
  extensions?: {
    fields?: GraphQLFieldError[];
  };
};

type GraphQLErrorResponse = {
  graphQLErrors?: GraphQLError[];
  errors?: GraphQLError[];
};

/**
 * Handles GraphQL errors and displays them as toasts.
 * Reads validation errors from extensions.fields (class-validator)
 * and displays each constraint message individually.
 */
export function handleGraphQLError(error: unknown, fallbackMessage = "Une erreur est survenue, veuillez réessayer.") {
  const gqlError = error as GraphQLErrorResponse | undefined;
  const gqlErrors = gqlError?.graphQLErrors || gqlError?.errors;

  if (gqlErrors?.length) {
    const firstError = gqlErrors[0];
    const fields = firstError.extensions?.fields;

    if (fields?.length) {
      fields.forEach((field) => {
        const messages = Object.values(field.constraints || {});
        messages.forEach((msg) => toast.error(msg));
      });
    } else {
      toast.error(firstError.message);
    }
  } else {
    toast.error(fallbackMessage);
  }
}
