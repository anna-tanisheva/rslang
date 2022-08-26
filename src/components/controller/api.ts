/* eslint-disable @typescript-eslint/no-unused-vars */
import {appState, ENDPOINT, textbookState} from "./state";
import {
    IUserSignUp,
    IUser,
    IUserSignIn,
    ISignInResponse,
    IWord,
} from "../../typings/typings";
import {AppView} from "../view/app-view";
import {
    PagePagination,
    WordDetails,
    WordsItem,
} from "../view/textbook/components";
import {isHTMLButtonElement} from "../../typings/utils/utils";

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
}: {
    group: number;
    page: number;
}): Promise<void> {
    const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
    const words = (await res.json()) as IWord[];
    textbookState.words = words;
    PagePagination.setDisabled();
    AppView.redrawView(appState.view);
    PagePagination.moveSlider();
}

export async function fetchWordsInPage({
    group,
    page,
}: {
    group: number;
    page: number;
}): Promise<void> {
    const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
    const words = (await res.json()) as IWord[];
    textbookState.words = words;
    PagePagination.setDisabled();
    WordsItem.drawNewWordsItem(words);
    WordDetails.setCard(words[0]);
    PagePagination.moveSlider();
}