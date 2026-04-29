import { toast } from "react-toastify";

/**
 * Handles GraphQL errors and displays them in toasts.
 * Reads validation errors from extensions.fields (class-validator)
 * and displays each constraint message individually.
 */
export function handleGraphQLError(error: any, fallbackMessage = "Une erreur est survenue, veuillez réessayer.") {
  const gqlErrors = error?.graphQLErrors || error?.errors;

  if (gqlErrors?.length) {
    const firstError = gqlErrors[0];
    const fields = firstError.extensions?.fields;

    if (fields?.length) {
      fields.forEach((field: any) => {
        const messages = Object.values(field.constraints || {}) as string[];
        messages.forEach((msg: string) => toast.error(msg));
      });
    } else {
      toast.error(firstError.message);
    }
  } else {
    toast.error(fallbackMessage);
  }
}
