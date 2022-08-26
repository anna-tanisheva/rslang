import {IAppState, ITextbookState} from "../../typings/typings";

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

export const audio = new Audio();
