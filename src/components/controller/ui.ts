import {WordDetails} from "../view/textbook/components";
import {IResWordsPage, IWord} from "../../typings";
import {fetchWords, postUser, logIn} from "./api";
import {appState, currentGame, gameState} from "./state";
import {
    isHTMLButtonElement,
    isHTMLElement,
    isHTMLDivElement,
    isHTMLInputElement,
} from "../../typings/utils/utils";
import {ISignInResponse, WordsData} from "../../typings/typings";
import { GamePopUp } from "../view/audio-call/game-page";
import { createElementWithContent, getRandomPage } from "../view/utils";
import { AudioCall } from "../view/audio-call/audio-call";

export function drawWordDetails(element: IWord) {
    const card = new WordDetails(element);
    return card.template;
}

async function getWords(): Promise<IResWordsPage> {
    const pageData = await fetchWords({
        group: appState.group,
        page: appState.page,
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
    const welcomeContainer = document.querySelector(".welcome-text");
    if (!isHTMLElement(welcomeContainer)) return;
    if (data.name === "unknown") {
        welcomeContainer.innerText = `Welcome stranger`;
    } else {
        welcomeContainer.innerText = `Welcome ${data.name} `;
    }
    if (data.name === "unknown") return;
    const logOutBtn = document.querySelector(".logout-submit");
    if (!isHTMLButtonElement(logOutBtn)) return;
    logOutBtn.removeAttribute("disabled");
}

function validationHandler(nodeList: Node[]): boolean | undefined {
    let valid = true;
    const invalidEmail = document.querySelector(".invalid-email");
    if (!isHTMLElement(invalidEmail)) return undefined;
    const invalidPassword = document.querySelector(".invalid-password");
    if (!isHTMLElement(invalidPassword)) return undefined;
    const invalidName = document.querySelector(".invalid-name");
    if (!isHTMLElement(invalidName)) return undefined;
    invalidEmail.classList.add("hidden");
    invalidPassword.classList.add("hidden");
    invalidName.classList.add("hidden");
    if (nodeList[0]) {
        if (
            !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(
                (nodeList[0] as HTMLInputElement).value
            )
        ) {
            valid = false;
            invalidEmail.classList.remove("hidden");
        }
    }
    if (nodeList[1]) {
        if ((nodeList[1] as HTMLInputElement).value.length < 8) {
            valid = false;
            invalidPassword.classList.remove("hidden");
        }
    }
    if (nodeList[2]) {
        if ((nodeList[2] as HTMLInputElement).value.length === 0) {
            valid = false;
            invalidName.classList.remove("hidden");
        }
    }
    if (valid) {
        invalidEmail.classList.add("hidden");
        invalidPassword.classList.add("hidden");
        invalidName.classList.add("hidden");
    }
    return valid;
}

function validateForm(form: string): boolean | undefined {
    let nameInput;
    let emailInput;
    let passwordInput;
    let isValid: boolean | undefined = true;
    switch (form) {
        case "registration":
            nameInput = document.querySelector(".registration-name");
            if (!isHTMLInputElement(nameInput)) return undefined;
            passwordInput = document.querySelector(".registration-password");
            if (!isHTMLInputElement(passwordInput)) return undefined;
            emailInput = document.querySelector(".registration-email");
            if (!isHTMLInputElement(emailInput)) return undefined;
            isValid = validationHandler([emailInput, passwordInput, nameInput]);
            break;
        case "login":
            emailInput = document.querySelector(".login-email");
            if (!isHTMLInputElement(emailInput)) return undefined;
            passwordInput = document.querySelector(".login-password");
            if (!isHTMLInputElement(passwordInput)) return undefined;
            isValid = validationHandler([emailInput, passwordInput]);
            break;
        default:
            break;
    }
    return isValid;
}

function serverErrorsHandler(message: string) {
    const messageContainer = document.querySelector(".incorrect-data");
    if (!isHTMLElement(messageContainer)) return;
    if (message === "403") {
        messageContainer.innerText =
            "Access denied, probably password was incorrect";
    } else if (message === "404") {
        messageContainer.innerText = "We couldn't find this user, check email";
    } else if (message === "417") {
        messageContainer.innerText = "This email is already used";
    } else if (message === "422") {
        messageContainer.innerText = "Incorrect email or password";
    }
}

export function setCurrentUserOnLoad() {
    if (!localStorage.appState) return;
    const {user} = JSON.parse(localStorage.appState);
    setCurrentUser(user);
}

export function showForms(e: Event): void {
    if (!isHTMLButtonElement(e.target)) return;
    const signIn = document.querySelector(".sign-in");
    if (!isHTMLElement(signIn)) return;
    const signUp = document.querySelector(".sign-up");
    if (!isHTMLElement(signUp)) return;

    if (e.target.classList.contains("show-sign-in")) {
        e.target.classList.add("active-form");
        if (!isHTMLButtonElement(e.target.nextElementSibling)) return;
        e.target.nextElementSibling.classList.remove("active-form");
        signIn.classList.remove("hidden");
        signUp.classList.add("hidden");
    } else if (e.target.classList.contains("show-sign-up")) {
        e.target.classList.add("active-form");
        if (!isHTMLButtonElement(e.target.previousElementSibling)) return;
        e.target.previousElementSibling.classList.remove("active-form");
        signIn.classList.add("hidden");
        signUp.classList.remove("hidden");
    }
}

export async function addNewUserHandler(e: Event): Promise<void> {
    e.preventDefault();
    const nameInput = document.querySelector(".registration-name");
    if (!isHTMLInputElement(nameInput)) return;
    const emailInput = document.querySelector(".registration-email");
    if (!isHTMLInputElement(emailInput)) return;
    const passwordInput = document.querySelector(".registration-password");
    if (!isHTMLInputElement(passwordInput)) return;
    if (!validateForm("registration")) return;
    const userData = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
    };
    try {
        await postUser(userData);
    } catch (err) {
        serverErrorsHandler((err as Error).message);
        return;
    }
    const signedIn = await logIn({
        email: userData.email,
        password: userData.password,
    });
    const formContainer = document.querySelector(".form-container");
    if (!isHTMLDivElement(formContainer)) return;
    formContainer.classList.add("hidden");
    setCurrentUser(signedIn);
    appState.isSignedIn = true;
    localStorage.setItem("appState", JSON.stringify(appState));
    passwordInput.value = "";
    emailInput.value = "";
    nameInput.value = "";
}

export async function signInHandler(e: Event): Promise<void> {
    e.preventDefault();
    const emailInput = document.querySelector(".login-email");
    if (!isHTMLInputElement(emailInput)) return;
    const passwordInput = document.querySelector(".login-password");
    if (!isHTMLInputElement(passwordInput)) return;
    if (!validateForm("login")) return;
    const userData = {
        email: emailInput.value,
        password: passwordInput.value,
    };
    let signedIn;
    try {
        signedIn = await logIn({
            email: userData.email,
            password: userData.password,
        });
    } catch (err) {
        serverErrorsHandler((err as Error).message);
        return;
    }
    const formContainer = document.querySelector(".form-container");
    if (!isHTMLDivElement(formContainer)) return;
    formContainer.classList.add("hidden");
    setCurrentUser(signedIn);
    appState.isSignedIn = true;
    localStorage.setItem("appState", JSON.stringify(appState));
    passwordInput.value = "";
    emailInput.value = "";
}

export function logOutHandler(): void {
    Object.keys(appState.user).forEach((key) => {
        appState.user[key as keyof typeof appState.user] = "unknown";
    });
    appState.isSignedIn = false;
    localStorage.setItem("appState", JSON.stringify(appState));
    const welcomeContainer = document.querySelector(".welcome-text");
    if (!isHTMLElement(welcomeContainer)) return;
    welcomeContainer.innerText = `Welcome stranger`;
    const logOutBtn = document.querySelector(".logout-submit");
    if (!isHTMLButtonElement(logOutBtn)) return;
    logOutBtn.setAttribute("disabled", "true");
}

export function showFormHandler() {
    document.querySelector(".form-container")?.classList.toggle("hidden");
}

export function setLocalStorage() {
    localStorage.clear();
    localStorage.setItem("appState", JSON.stringify(appState));
}

export function getLocalStorage() {
    if (localStorage.getItem("appState")) {
        const {isSignedIn, group, page, user, view} = JSON.parse(
            localStorage.appState
        );
        appState.isSignedIn = isSignedIn;
        appState.group = group;
        appState.page = page;
        appState.user = user;
        appState.view = view;
    }
}

// games

export function moveGameSlider(sliderContainer: HTMLElement, nextButton: HTMLElement) {
    const innerSliderContainer = sliderContainer;
    if (sliderContainer.style.left !== '-900%') {
        innerSliderContainer.style.left = `${Number((innerSliderContainer.style.left).split('%')[0]) - 100}%`
    } else {
        innerSliderContainer.style.left = `${Number((innerSliderContainer.style.left).split('%')[0]) - 100}%`;
        const container = sliderContainer.closest('.game-popup');
        if (!isHTMLElement(container)) return;
        container.querySelector('.game-stats-wrapper')?.classList.remove('opacity-hidden');
        nextButton.setAttribute('disabled', 'true');
    }
}

export function startGame(container: HTMLElement, section: number, game: string, page: number) {
    const popup = new GamePopUp().create(section, game, page);
    container.append(popup);
    const closeButton = container.querySelector('.close-button');
    if (!isHTMLElement(closeButton)) return;
    closeButton.addEventListener('click', ()=>{
        currentGame.game = null;
        container.removeChild(popup);
    })
    const nextButton = container.querySelector('.next-button');
    if (!isHTMLElement(nextButton)) return;
    nextButton.addEventListener('click', ()=>{
        const sliderContainer = popup.querySelector('.audio-call');
        if (!isHTMLDivElement(sliderContainer)) return;
        moveGameSlider(sliderContainer, nextButton)
    })
}

export function startGameHandler(e: Event): void {
    const CALL_GAME = 'Audio Call';
    // const SPRINT = 'Sprint';
    const {target} = e;
    const gameContainer = document.querySelector('.games');
    if (!isHTMLElement(gameContainer)) return;
    if (!isHTMLButtonElement(target)) return;
    if (!target.classList.contains('start-button')) return;
    if (target.classList.contains('sprint')) {
        console.log('sprint');
        // логика по созданию экземпляра игры
        // const section = Number(target.closest('.game-container')?.querySelector('select')?.value);
        // startGame(gameContainer, section, SPRINT);
    } else {
        const section = Number(target.closest('.game-container')?.querySelector('select')?.value);
        const page = getRandomPage();
        startGame(gameContainer, section, CALL_GAME, page);
    }
}

export function getGameWordsArr(arr: WordsData) {
    const output: IWord[] = [];
    while(output.length < 10) {
        const ind = Math.floor(Math.random() * arr.length);
        if (!output.includes(arr[ind])) output.push(arr[ind])
    }
    return output;
}

export function playWordInGameHandler(e: Event){
    const {target} = e;
    if(!isHTMLButtonElement(target)) return;
    const container = target.closest('.word-card');
    if(!isHTMLDivElement(container)) return;
    const audio = container.querySelector('audio');
    if(!isHTMLElement(audio)) return;
    audio.play();
}

export function getOptions(arr: string[], word: string) {
    const options = [word];
    while (options.length < 4) {
        const ind = Math.floor(Math.random() * arr.length);
        if (!options.includes(arr[ind])) options.push(arr[ind])
    }
    return options;
}

function addToCurrentGameState(guess: boolean){
    if (guess){
        (currentGame.game as AudioCall).state.correctGuesses += 1;
        (currentGame.game as AudioCall).state.currentStrick += 1;
        if ((currentGame.game as AudioCall).state.currentStrick > (currentGame.game as AudioCall).state.maxStrick) {
            (currentGame.game as AudioCall).state.maxStrick = (currentGame.game as AudioCall).state.currentStrick;
        }
    } else {
        (currentGame.game as AudioCall).state.currentStrick = 0;
    }
}

export function appendGameStats(wrapper: HTMLElement) {
    const correctAnswers = createElementWithContent('p', `Вы ответили правильно на ${String((currentGame.game as AudioCall).state.correctGuesses)} вопросов`);
    const strick = createElementWithContent('p', `Самая длинная последовательность правильных ответов: ${String((currentGame.game as AudioCall).state.maxStrick)}`);
    const name = createElementWithContent('h3', String((currentGame.game as AudioCall).gameName));
    wrapper.append(name, strick, correctAnswers);
    return wrapper;
}

export function choseAnswerHandler(e: Event, answer: string) {
    const {target} = e;
    if(!isHTMLButtonElement(target)) return;
    const container = target.closest('.game-popup');
    if(!isHTMLDivElement(container)) return;
    const wrongSound = container.querySelector('.wrong-sound');
    if(!isHTMLElement(wrongSound)) return;
    const correctSound = container.querySelector('.correct-sound');
    if(!isHTMLElement(wrongSound)) return;
    const card = target.closest('.word-card');
    if(!isHTMLDivElement(card)) return;
    const flipContainer = card.querySelector('.flip-container');
    if(!isHTMLDivElement(flipContainer)) return;
    flipContainer.classList.add('answered');
    const img = card.querySelector('img');
    if(!isHTMLElement(img)) return;
    const answerButtons = card.querySelectorAll('.option');
    const correctAnswer = card.querySelector('.answer');
    if(!isHTMLElement(correctAnswer)) return;
    if (target.getAttribute('data-option') !== answer) {
        (wrongSound as HTMLAudioElement).play();
        target.classList.add('incorrect-answer');
        answerButtons.forEach(button=>{
            if(button.getAttribute('data-option') === answer) button.classList.add('correct-answer');
            (button as HTMLButtonElement).setAttribute('disabled', 'true');
        });
        addToCurrentGameState(false)
    } else {
        target.classList.add('correct-answer');
        (correctSound as HTMLAudioElement).play();
        answerButtons.forEach(button=>{
            (button as HTMLButtonElement).setAttribute('disabled', 'true');
        })
        addToCurrentGameState(true)
    }
    correctAnswer.classList.remove('opacity-hidden');
    const statsCurrentContainer = document.querySelector('.game-stats-wrapper');
    if(!isHTMLElement(statsCurrentContainer)) return;
    const statsOld = statsCurrentContainer.querySelector('.game-stats');
    if(!isHTMLElement(statsOld)) return;
    statsOld.replaceChildren();
    const statsNew = appendGameStats(statsOld);
    statsCurrentContainer.replaceChild(statsOld, statsNew);
    gameState.correctAnswers = (currentGame.game as AudioCall).state.correctGuesses;
    gameState.correctAnswersStrick = (currentGame.game as AudioCall).state.maxStrick;
}