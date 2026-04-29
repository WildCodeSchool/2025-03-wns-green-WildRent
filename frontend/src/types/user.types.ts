export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  avatar?: string;
}

export interface UpdateUserInput {
  firstname?: string;
  lastname?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  city?: string;
}
