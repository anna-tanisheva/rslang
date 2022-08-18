import { isHTMLButtonElement, isHTMLElement, isHTMLInputElement } from "../../typings/utils/utils";
import { postUser, logIn } from "./api";
import { appState } from "./state";
import { ISignInResponse } from "../../typings/typings"

function setCurrentUser(data: ISignInResponse) {
  appState.user.name = data.name;
  appState.user.userId = data.userId;
  appState.user.refreshToken = data.refreshToken;
  appState.user.token = data.token;
}

export function setCurrentUserOnLoad() {
  if(!localStorage.appState) return;
  const {user} = JSON.parse(localStorage.appState);
  setCurrentUser(user);
  console.log(user)
}

export function showForms(e: Event): void {
  if(!isHTMLButtonElement(e.target)) return;
  const signIn = document.querySelector('.sign-in');
  if(!isHTMLElement(signIn)) return;
  const signUp = document.querySelector('.sign-up');
  if(!isHTMLElement(signUp)) return;

  if(e.target.classList.contains('show-sign-in')) {
    e.target.classList.add('active-form');
    if (!isHTMLButtonElement(e.target.nextElementSibling)) return;
    e.target.nextElementSibling.classList.remove('active-form');
    signIn.classList.remove('hidden');
    signUp.classList.add('hidden');
  } else if (e.target.classList.contains('show-sign-up')) {
    e.target.classList.add('active-form');
    if (!isHTMLButtonElement(e.target.previousElementSibling)) return;
    e.target.previousElementSibling.classList.remove('active-form');
    signIn.classList.add('hidden');
    signUp.classList.remove('hidden');
  }
}

export async function addNewUserHandler(): Promise<void> {
  const nameInput = document.querySelector('.registration-name');
  if(!isHTMLInputElement(nameInput)) return;
  const emailInput = document.querySelector('.registration-email');
  if(!isHTMLInputElement(emailInput)) return;
  const passwordInput = document.querySelector('.registration-password');
  if(!isHTMLInputElement(passwordInput)) return;
  const userData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value
  }
  await postUser(userData);
  const signedIn = await logIn({
    email: userData.email,
    password: userData.password
  });
  setCurrentUser(signedIn);
  appState.isSignedIn = true;
  localStorage.setItem('appState', JSON.stringify(appState));
  passwordInput.value = '';
  emailInput.value = '';
  nameInput.value = '';
}

export async function signInHandler(): Promise<void> {
  const emailInput = document.querySelector('.login-email');
  if(!isHTMLInputElement(emailInput)) return;
  const passwordInput = document.querySelector('.login-password');
  if(!isHTMLInputElement(passwordInput)) return;
  const userData = {
    email: emailInput.value,
    password: passwordInput.value
  }
  const signedIn = await logIn({
    email: userData.email,
    password: userData.password
  });
  setCurrentUser(signedIn);
  appState.isSignedIn = true;
  localStorage.setItem('appState', JSON.stringify(appState));
  passwordInput.value = '';
  emailInput.value = '';
}

export function logOutHandler(): void {
  Object.keys(appState.user).forEach(key => {
    appState.user[(key as keyof typeof appState.user)] = 'unknown'
  })
  appState.isSignedIn = false;
  localStorage.setItem('appState', JSON.stringify(appState));
}