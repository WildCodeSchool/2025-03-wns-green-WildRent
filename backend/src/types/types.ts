import { IncomingMessage, ServerResponse } from "node:http";

export type UserToken = {
  mail: string,
  firstName: string,
  lastName: string
};

export type BaseContext = {
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
};

// Anonymous contexte = Context pour user non connecté
export type AnonContext = BaseContext & {
  user?: undefined
};

// Authentified Context = COntext pour user connecté
export type AuthContext = BaseContext & {
  user: UserToken
};