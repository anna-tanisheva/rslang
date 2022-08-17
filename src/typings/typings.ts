interface IWord {
  id: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string
}

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IUserSignUp {
  name: string;
  email: string;
  password: string;
}

interface IUserSignIn {
  email: string;
  password: string;
}

interface ISignInResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string
}

interface IAppState {
  isSignedIn: boolean;
  user: ISignInResponse | null;
  group: number;
  page: number;
}

interface IWordProgress {
  isSignedIn: boolean;
  user: ISignInResponse | null;
  group: number;
  page: number;
}