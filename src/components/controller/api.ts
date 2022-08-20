/* eslint-disable @typescript-eslint/no-unused-vars */
import {IResWordsPage, IWord} from "../../typings";
import { ENDPOINT } from "./state";
import { IUserSignUp, IUser, IUserSignIn, ISignInResponse } from "../../typings/typings";

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


export async function postUser(body: IUserSignUp): Promise<IUser> {
  const res = await fetch(`${ENDPOINT}/users`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return res.json();
}

export async function logIn(body: IUserSignIn): Promise<ISignInResponse> {
  const res = await fetch(`${ENDPOINT}/signin`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return res.json();
}

export async function getUser(id: string, token: string) {
  const res = await fetch(`${ENDPOINT}/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return res.json();
}

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
