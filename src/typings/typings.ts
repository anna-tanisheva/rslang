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
        rightAnswerSeries: number;
    };
}

export interface IUser {
    userId: string;
    name: string;
    token?: string;
    refreshToken?: string;
    statsToday?: unknown;
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
    userNull: IUserStats;
    usersStats: unknown[];
}

export interface IUserStats {
    statisticTimeStamp: string | null;
    statisticState: IStatisticState;
}

export interface IUserStatsInArr {
    [key: string]: IUserStats;
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
        correctAnswersPercent: number;
        wordsLearntArr: IWordLearningState[];
        wordsLearnt: number;
        correctAnswers: number;
        correctAnswersStrick: number;
    };
    audioCall: {
        correctAnswersPercent: number;
        numberOfGames: number;
        wordsLearntArr: IWordLearningState[];
        wordsLearnt: number;
        correctAnswers: number;
        correctAnswersStrick: number;
    };
    sprint: {
        correctAnswersPercent: number;
        numberOfGames: number;
        wordsLearntArr: IWordLearningState[];
        wordsLearnt: number;
        correctAnswers: number;
        correctAnswersStrick: number;
    };
}

export interface ICurrentGame {
    game: unknown;
}

export interface ITextbookViewState {
    group: number;
    page: number;
}

export interface ITextbookState {
    words: IAggreagtedWord[];
}

export enum KeyboardCodes {
    'one' = 1,
    'two',
    'three',
    'four',
    'enter' = 'Enter',
    'arrowRight' = 'ArrowRight'
}

export interface IWordLearningState {
    [key: string]: number;
}