export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  storage: number;
  used: number;
  createdAt: Date;
}
