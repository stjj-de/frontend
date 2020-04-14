import { User } from "./models/User";

export interface Context {
  user: User | null;
}

export interface AuthenticatedContext extends Context {
  user: User;
}
