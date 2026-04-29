import { IncomingMessage, ServerResponse } from "node:http";

export type UserToken = {
  id: number,
  mail: string,
  firstName: string,
  lastName: string,
  role: string,
};

export type BaseContext = {
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
};

export type AnonContext = BaseContext & {
  user?: undefined
};
export type AuthContext = BaseContext & {
  user: UserToken
};