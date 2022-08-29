import {
    IAppState,
    // IStatisticState,
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
        statsToday: {
            statisticTimeStamp: null,
            statisticState: {
                total: {
                    correctAnswersPercent: 0,
                    wordsLearntArr: [],
                    wordsLearnt: 0,
                    correctAnswers: 0,
                    correctAnswersStrick: 0,
                },
                audioCall: {
                    correctAnswersPercent: 0,
                    numberOfGames: 0,
                    wordsLearntArr: [],
                    wordsLearnt: 0,
                    correctAnswers: 0,
                    correctAnswersStrick: 0,
                },
                sprint: {
                    correctAnswersPercent: 0,
                    numberOfGames: 0,
                    wordsLearntArr: [],
                    wordsLearnt: 0,
                    correctAnswers: 0,
                    correctAnswersStrick: 0
                },
            }
        }
    },
    viewsStates: {
        textbook: {
            group: 0,
            page: 0,
        },
    },
    view: "index",
    userNull: {
        statisticTimeStamp: null,
        statisticState: {
            total: {
                correctAnswersPercent: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
            },
            audioCall: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
            },
            sprint: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0
            },
        }
    },
    usersStats: []
};

export const textbookState: ITextbookState = {
    words: [],
};

export const TEXTBOOK_GROUP_COUNT = 6;
export const TEXTBOOK_GROUP_SIZE = 600;
export const TEXTBOOK_PAGE_COUNT = 30;
export const WORDS_IN_GAME = 10;

export const currentGame: ICurrentGame = {game: null};

export const audio = new Audio();

export const KEYBOARD_CODES = ['1', '2', '3', '4', 'Enter', 'ArrowRight'];