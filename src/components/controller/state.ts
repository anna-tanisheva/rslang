import {
    IAppState,
    IStatisticState,
    ICurrentGame,
    ITextbookState,
} from "../../typings/typings";

export const ENDPOINT = "http://localhost:3000";

export const appState: IAppState = {
    isSignedIn: false,
    user: {
        userId: "",
        name: "",
        token: "",
        refreshToken: "",
    },
    viewsStates: {
        textbook: {
            group: 0,
            page: 0,
        },
    },
    view: "index",
};

export const textbookState: ITextbookState = {
    words: [],
};

export const TEXTBOOK_GROUP_COUNT = 6;
export const TEXTBOOK_GROUP_SIZE = 600;
export const TEXTBOOK_PAGE_COUNT = 30;

export const statisticState: IStatisticState = {
    // для неавторизованного пользователя количество выученных слов всегда 0, после авторизации эту логику надо прописать
    total: {
        wordsLearnt: 0,
        correctAnswers: 0,
        correctAnswersStrick: 0,
    },
    audioCall: {
        wordsLearnt: 0,
        correctAnswers: 0,
        correctAnswersStrick: 0,
    },
    sprint: {
        wordsLearnt: 0,
        correctAnswers: 0,
        correctAnswersStrick: 0,
    },
};

export const currentGame: ICurrentGame = {game: null};

export const audio = new Audio();
