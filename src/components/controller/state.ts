import { IUser } from "../../typings/typings";

export const ENDPOINT = 'http://localhost:3000';

export const currentUser: IUser = {
  userId: 'unknown',
  name: 'unknown',
  token: 'unknown',
  refreshToken: 'unknown'
}