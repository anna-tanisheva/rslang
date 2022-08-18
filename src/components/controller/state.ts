import { IUser, IAppState } from "../../typings/typings";

export const ENDPOINT = 'http://localhost:3000';

export const appState: IAppState = {
  isSignedIn: false,
  user: { userId: 'unknown',
          name: 'unknown',
          token: 'unknown',
          refreshToken: 'unknown' },
  group: 0,
  page: 0
}