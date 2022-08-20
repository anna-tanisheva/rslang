
import {WordDetails} from "../view/textbook";
import {IResWordsPage, IWord} from "../../typings";
import {fetchWords, postUser, logIn} from "./api";
import { textbookState, appState } from "./state";
import { isHTMLButtonElement, isHTMLElement, isHTMLInputElement } from "../../typings/utils/utils";
import { ISignInResponse } from "../../typings/typings"

export function drawWordDetails(element: IWord) {
    const card = new WordDetails(element);
    return card.template;
}

async function getWords(): Promise<IResWordsPage> {
    const pageData = await fetchWords({
        group: textbookState.group,
        page: textbookState.page,
    });
    return pageData;
}

export async function drawTextbook(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pageData = await getWords();
}


function setCurrentUser(data: ISignInResponse) {
  appState.user.name = data.name;
  appState.user.userId = data.userId;
  appState.user.refreshToken = data.refreshToken;
  appState.user.token = data.token;
  const welcomeContainer = document.querySelector('.welcome-text');
  if(!isHTMLElement(welcomeContainer)) return;
  if (data.name === 'unknown') {
    welcomeContainer.innerText = `Welcome stranger`
  } else {
    welcomeContainer.innerText = `Welcome ${data.name} `;
  };
  if (data.name === 'unknown') return;
  const logOutBtn = document.querySelector('.logout-submit');
  if(!isHTMLButtonElement(logOutBtn)) return;
  logOutBtn.removeAttribute('disabled');
}

// function validateForm() {
//   const nameInput = document.querySelector('.registration-name');
//   if(!isHTMLInputElement(nameInput)) return;
//   const emailInput = document.querySelector('.registration-email');
//   if(!isHTMLInputElement(emailInput)) return;
//   const passwordInput = document.querySelector('.registration-password');
//   if(!isHTMLInputElement(passwordInput)) return;
//   // if(!nameInput.value || emailInput.value.indexOf('@') === -1 || emailInput.value.indexOf('.') === -1 || )
//   if(!nameInput.value) {

//   }
// }

export function setCurrentUserOnLoad() {
  if(!localStorage.appState) return;
  const {user} = JSON.parse(localStorage.appState);
  setCurrentUser(user);
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
  const welcomeContainer = document.querySelector('.welcome-text');
  if(!isHTMLElement(welcomeContainer)) return;
  welcomeContainer.innerText = `Welcome stranger`;
  const logOutBtn = document.querySelector('.logout-submit');
  if(!isHTMLButtonElement(logOutBtn)) return;
  logOutBtn.setAttribute('disabled', 'true');
}

export function showFormHandler() {
  document.querySelector('.form-container')?.classList.toggle('hidden')
}

