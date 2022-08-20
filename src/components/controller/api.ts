import { ENDPOINT } from "./state";
import { IUserSignUp, IUser, IUserSignIn, ISignInResponse } from "../../typings/typings";

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