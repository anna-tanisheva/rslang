import {IAppState} from "../../typings/typings";

export const ENDPOINT = "http://localhost:3000";

export const appState: IAppState = {
    isSignedIn: false,
    user: {
        userId: "unknown",
        name: "unknown",
        token: "unknown",
        refreshToken: "unknown",
    },
    group: 0,
    page: 0,
    view: "index",
};

export const TEXTBOOK_GROUP_COUNT = 6;
export const TEXTBOOK_GROUP_SIZE = 600;
export const TEXTBOOK_PAGE_COUNT = 30;
