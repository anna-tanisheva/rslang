/* eslint-disable @typescript-eslint/no-unused-vars */
import {IResWordsPage, IWord} from "../../typings";

const BASE_URL = "http://localhost:3000";
const ID = "";

const SIGNIN = `${BASE_URL}/signin`;
const USERS = `${BASE_URL}/users`;
const WORDS = `${BASE_URL}/words`;
const USERS_ID = `${BASE_URL}/users/${ID}`;
const TOKENS = `${USERS_ID}/tokens`;
const SETTINGS = `${USERS_ID}/settings`;
const STATISTICS = `${USERS_ID}/statistics`;
const USERS_WORDS = `${USERS_ID}/words`;
const AGGREGATED_WORDS = `${USERS_ID}/aggregatedWords`;

export async function fetchWords({
    group,
    page,
}: {
    group: number;
    page: number;
}): Promise<IResWordsPage> {
    const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
    const words = await res.json();
    return {
        words,
        group,
        page,
    };
}
