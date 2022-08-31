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

export interface IAggreagtedWord extends IWord {
    _id: string;
    userWord?: IUserWord;
}

export interface IUserWord {
    difficulty: string;
    optional: {
        audiocall: {
            countGames: number;
            rightAnswer: number;
            rightAnswerSeries: number;
        };
        sprint: {
            countGames: number;
            rightAnswer: number;
            rightAnswerSeries: number;
        };
    };
}

export interface IUserWordResponse extends IUserWord {
    id: string;
    wordId: string;
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
    viewsStates: {
        textbook: ITextbookViewState;
    };
    view: string;
}

export interface IWordProgress {
    isSignedIn: boolean;
    user: ISignInResponse | null;
    group: number;
    page: number;
}

export type WordsData = IAggreagtedWord[];

export interface IResWordsPage {
    words: WordsData;
}

export interface IStatisticState {
    total: {
        wordsLearnt: number;
        correctAnswers: number;
        correctAnswersStrick: number;
    };
    audioCall: {
        wordsLearnt: number;
        correctAnswers: number;
        correctAnswersStrick: number;
    };
    sprint: {
        wordsLearnt: number;
        correctAnswers: number;
        correctAnswersStrick: number;
    };
}

export interface ICurrentGame {
    game: unknown;
}

export interface ITextbookViewState {
    dictionaryMode: string;
    mode: string;
    group: number;
    page: number;
}

export interface ITextbookState {
    words: IAggreagtedWord[];
}
