/* eslint-disable @typescript-eslint/no-unused-vars */
import {appState, ENDPOINT, textbookState} from "./state";
import {
    IUserSignUp,
    IUser,
    IUserSignIn,
    ISignInResponse,
    IAggreagtedWord,
    IResWordsPage,
} from "../../typings/typings";
import {AppView} from "../view/app-view";
import {
    PagePagination,
    WordDetails,
    WordsItem,
} from "../view/textbook/components";

export const BASE_URL = "http://localhost:3000";
const ID = "";

const SIGNIN = `${BASE_URL}/signin`;
const USERS = `${BASE_URL}/users`;
const USERS_ID = `${BASE_URL}/users/${ID}`;
const WORDS = `${BASE_URL}${
    appState.user.userId ? `/${appState.user.userId}` : ""
}/words`;
const TOKENS = `${USERS_ID}/tokens`;
const SETTINGS = `${USERS_ID}/settings`;
const STATISTICS = `${USERS_ID}/statistics`;
const AGGREGATED_WORDS = `${USERS_ID}/aggregatedWords`;

const URLs = {
    signIn: `${BASE_URL}/signin`,
    users: `${BASE_URL}/users`,
    words: `${BASE_URL}/words`,
    wordsID: (id: string) => `${BASE_URL}/words/${id}`,
    usersID: () => `${BASE_URL}/users/${appState.user.userId}`,
    usersIDSettings: () => `${BASE_URL}/users/${appState.user.userId}/settings`,
    usersIDStatistics: () =>
        `${BASE_URL}/users/${appState.user.userId}/statistics`,
    usersIDWords: () => `${BASE_URL}/users/${appState.user.userId}/words`,
    usersIDTokens: () => `${BASE_URL}/users/${appState.user.userId}/tokens`,
    usersIDWordsWordID: (id: string) =>
        `${BASE_URL}/users/${appState.user.userId}/words/${id}`,
    usersIDaggregatedWords: () =>
        `${BASE_URL}/users/${appState.user.userId}/aggregatedWords`,
    usersIDaggregatedWordsID: (id: string) =>
        `${BASE_URL}/users/${appState.user.userId}/aggregatedWords/${id}`,
};

export async function postUser(body: IUserSignUp): Promise<IUser> {
    const res = await fetch(`${ENDPOINT}/users`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    if (res.status === 417) {
        throw new Error("417");
    } else if (res.status === 422) {
        throw new Error("422");
    }
    return res.json();
}

export async function logIn(body: IUserSignIn): Promise<ISignInResponse> {
    const res = await fetch(`${ENDPOINT}/signin`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    if (res.status === 403) {
        throw new Error("403");
    } else if (res.status === 404) {
        throw new Error("404");
    }
    return res.json();
}

export async function getUser(id: string, token: string) {
    const res = await fetch(`${ENDPOINT}/users/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

export async function fetchWords({
    group,
    page,
    wordsPerPage,
}: {
    group?: number;
    page?: number;
    wordsPerPage?: number;
}): Promise<IResWordsPage> {
    let url = "";
    let urlParams = "";
    const options = {
        headers: {
            accept: "application/json",
            authorization: "",
        },
        method: "GET",
    };
    if (!appState.isSignedIn) {
        urlParams = `?group=${group}&page=${page}`;
        url = URLs.words + urlParams;
    } else {
        options.headers.authorization = `Bearer ${appState.user.token}`;
        urlParams = `?${group !== undefined ? `&group=${group}` : ""}${
            page !== undefined ? `&page=${page}` : ""
        }${wordsPerPage !== undefined ? `&wordsPerPage=${wordsPerPage}` : ""}`;
        url = URLs.usersIDaggregatedWords() + urlParams;
    }
    const res = await fetch(url, options);
    const respData = await res.json();
    const words: IAggreagtedWord[] = [];
    if (!appState.isSignedIn) {
        words.push(...(respData as IAggreagtedWord[]));
    } else {
        let {
            paginatedResults,
        }: {paginatedResults: IAggreagtedWord[]} = respData[0];
        paginatedResults = paginatedResults.map((item) => {
            // eslint-disable-next-line no-underscore-dangle
            const obj = {id: !item.id ? item._id : item.id};
            return Object.assign(item, obj);
        });
        words.push(...paginatedResults);
    }
    return {
        words,
    };
}

export async function fetchWordsInTextbook({
    group,
    page,
}: {
    group: number;
    page: number;
}): Promise<void> {
    const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
    const words = (await res.json()) as IAggreagtedWord[];
    textbookState.words = words;
    //    AppView.redrawView(appState.view);
    // PagePagination.setDisabled();
    /* WordsItem.drawNewWordsItem(words);
    WordDetails.setCard(words[0]); */
    // PagePagination.moveSlider();
}

export async function fetchWordsInPage({
    group,
    page,
}: {
    group: number;
    page: number;
}): Promise<void> {
    const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
    const words = (await res.json()) as IAggreagtedWord[];
    textbookState.words = words;
    PagePagination.setDisabled();
    WordsItem.drawNewWordsItem(words);
    WordDetails.setCard(words[0]);
    PagePagination.moveSlider();
}