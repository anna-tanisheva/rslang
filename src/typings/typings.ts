export interface IWord {

    id: string;
    audio: string;
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
    wordTranslate: string;
}

export interface IUser {
    userId: string;
    name: string;
    token?: string;
    refreshToken?: string;
}

export interface IUserSignUp {
    name: string;
    email: string;
    password: string;
}

export interface IUserSignIn {
    email: string;
    password: string;
}

export interface ISignInResponse {
    message: string;
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
}

export interface IAppState {
    isSignedIn: boolean;
    user: IUser;
    group: number;
    page: number;
    view: string;
}

export interface IWordProgress {
    isSignedIn: boolean;
    user: ISignInResponse | null;
    group: number;
    page: number;
}

export type WordsData = IWord[];

export interface IResWordsPage {
    words: WordsData;
    group: number;
    page: number;
}

export interface IStatisticState {
    'total': {
        'wordsLearnt': number;
        'correctAnswers': number;
        'correctAnswersStrick': number
    },
    'audioCall': {
        'wordsLearnt': number;
        'correctAnswers': number;
        'correctAnswersStrick': number;
    },
    'sprint': {
        'wordsLearnt': number;
        'correctAnswers': number;
        'correctAnswersStrick': number;
    }
}

export interface ICurrentGame {
    game: unknown;
}