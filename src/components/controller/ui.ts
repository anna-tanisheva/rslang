/* eslint-disable no-param-reassign */
import { Chart, ChartItem, registerables } from "chart.js";
import {IAggreagtedWord} from "../../typings";
import {
    postUser,
    logIn,
    setTexbookStateWords,
    putUserStatistic,
    fetchPostOrPutUserWord,
    fetchUserStatistic,
    getUserWord
} from "./api";
import {
    appState,
    currentGame,
    TEXTBOOK_PAGE_COUNT,
    ENDPOINT,
    COLORS,
    AUDIO_CALL,
    SPRINT
} from "./state";
import {
    isHTMLButtonElement,
    isHTMLElement,
    isHTMLDivElement,
    isHTMLInputElement,
} from "../../typings/utils/utils";

import {ISignInResponse, WordsData, IUser, IUserStats, IUserStatsInArr, IWordLearningState, KeyboardCodes, IUserWord,
    IUserStatisticToDB,
    IResWordsPage
} from "../../typings/typings";

import {GamePopUp} from "../view/audio-call/game-page";
import {
    getRandomInRange,
    createElementWithAttributes,
    createElementWithClassnames,
    createElementWithContent,
} from "../view/utils";
import {AudioCall} from "../view/audio-call/call/audio-call";
import {GameStats} from "../view/audio-call/call/game-stats";
import {AppView} from "../view/app-view";
import {PagePagination} from "../view/textbook/components";
import { Sprint } from "../view/audio-call/sprint/sprint-model";

export async function getActiveViewData() {
  switch (appState.view) {
      case "textbook": {
          let wordsPerPage;
          let filter;
          let page;
          let group;
          if (!appState.isSignedIn) {
              group = appState.viewsStates.textbook.group;
              page = appState.viewsStates.textbook.page;
          } else {
              wordsPerPage = 20;
              if (appState.viewsStates.textbook.mode === "textbook") {
                  group = appState.viewsStates.textbook.group;
                  page = appState.viewsStates.textbook.page;
              } else if (
                  appState.viewsStates.textbook.mode === "dictionary"
              ) {
                  filter = `{"userWord.difficulty":"${appState.viewsStates.textbook.dictionaryMode}"}`;
                  wordsPerPage = 3600;
              }
          }
          await setTexbookStateWords({
              group,
              page,
              filter,
              wordsPerPage,
          });
          break;
      }
      default:
  }
  AppView.redrawView();
  if (appState.view === "textbook") PagePagination.moveSlider();
}

// stats one day
Chart.register(...registerables);


export function setDailyChart(chart: HTMLCanvasElement, data: number[]) {
    const ctx = (chart as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart((ctx as ChartItem), {
      type: 'doughnut',
      data: {
          labels: [`${data[0]} % правильных ответов за сегодня`],
          datasets: [{
              data,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1
          }]
      },
  });
  return myChart
}
export function isUserInUserStats(user: IUser) {
    const id = `user${user.userId}`;
    return appState.usersStats.find((elem) => Object.keys(elem as IUserStats)[0] === id) || false;
}

export function setEmptyStatistic(str: string){
    return {
        statisticTimeStamp: str,
        statisticState: {
            total: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
                totalAnswers: 0
            },
            audioCall: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
                totalAnswers: 0
            },
            sprint: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
                totalAnswers: 0
            },
        }
    }
}

export function areDaysEqual(oldDate: string, newDate :string) {
    [oldDate] = oldDate.split('T');
    [newDate] = newDate.split('T');
    oldDate = oldDate.slice(oldDate.length - 2);
    newDate = newDate.slice(newDate.length - 2);
    if(Number(oldDate) !== Number(newDate)) {
        return false;
    }
    return true;
}

function setNewDate() {
    return new Date().toJSON();
}

function setUserStatsArr(user: IUser){
    const userInUserStats = isUserInUserStats(user);
    if(!userInUserStats) {
        const id = `user${user.userId}`
        const newUser: IUserStatsInArr = {};
        newUser[id] = (user.statsToday as IUserStats);
        appState.usersStats.push(newUser);
    }
}

export function isWordInWordsLearnt(wordId: string, user: IUserStats, game: string) {
    return user.statisticState[game as keyof typeof user.statisticState].wordsLearntArr.find((word) => Object.keys(word)[0] === wordId) || false;
}

export function calcCorrectAnswersPercent(answers: number, wordsInGames: number) {

    return Math.floor((Number(answers) * 100) / wordsInGames);
}

function setGameStatisticToStats(
    game: AudioCall | Sprint,
    user: IUserStats,
    gameState: AudioCall["state"] | Sprint["state"],
    usersStats: IUserStats["statisticState"],
    gameName: string
    ) {
        usersStats[gameName as keyof typeof usersStats].correctAnswers += gameState.answers.true.length;
        if(usersStats[gameName as keyof typeof usersStats].correctAnswersStrick < gameState.maxStrick) {
            usersStats[gameName as keyof typeof usersStats].correctAnswersStrick = gameState.maxStrick;
        }
        gameState.answers.true.forEach(word => {
            const wordInWordsLearnt = isWordInWordsLearnt(word, user, AUDIO_CALL);
            if(!wordInWordsLearnt) {
                const wordOnLearning: IWordLearningState = {};
                wordOnLearning[word] = 1
                usersStats[gameName as keyof typeof usersStats].wordsLearntArr.push((wordOnLearning));
            } else {
                wordInWordsLearnt[word] += 1;
                if(wordInWordsLearnt[word] === 3) {
                    usersStats[gameName as keyof typeof usersStats].wordsLearnt += 1;
                }
                if(wordInWordsLearnt[word] > 3) {
                    wordInWordsLearnt[word] = 3;
                }
            }
        });
        gameState.answers.false.forEach(word => {
            const wordInWordsLearnt = isWordInWordsLearnt(word, user, AUDIO_CALL);
            if(wordInWordsLearnt) {
                wordInWordsLearnt[word] = 0;
                if (usersStats[gameName as keyof typeof usersStats].wordsLearnt > 0) {
                    usersStats[gameName as keyof typeof usersStats].wordsLearnt -= 1
                } else {
                    usersStats[gameName as keyof typeof usersStats].wordsLearnt = 0;
                }
            }
        });
        usersStats[gameName as keyof typeof usersStats].numberOfGames += 1;
        const totalWordsInGames = game.state.answers.false.length + game.state.answers.true.length;
        usersStats[gameName as keyof typeof usersStats].totalAnswers += totalWordsInGames
        usersStats[gameName as keyof typeof usersStats].correctAnswersPercent = calcCorrectAnswersPercent(
            usersStats[gameName as keyof typeof usersStats].correctAnswers, usersStats[gameName as keyof typeof usersStats].totalAnswers
        );
}


export async function setStats(
    game: AudioCall | Sprint,
    user: IUserStats,
    ) {
    if(game instanceof AudioCall) {
        setGameStatisticToStats(game, user, game.state, user.statisticState, AUDIO_CALL);
    } else {
        setGameStatisticToStats(game, user, game.state, user.statisticState, SPRINT);
    }
    user.statisticState.total.correctAnswers += game.state.answers.true.length;
    user.statisticState.total.wordsLearnt = user.statisticState.audioCall.wordsLearnt + user.statisticState.sprint.wordsLearnt;
    user.statisticState.total.numberOfGames += 1;
    const totalWordsInGames = user.statisticState.audioCall.totalAnswers + user.statisticState.sprint.totalAnswers
    user.statisticState.total.correctAnswersPercent = calcCorrectAnswersPercent(user.statisticState.total.correctAnswers, totalWordsInGames);
    if(!appState.isSignedIn) return;
    setUserStatsArr(appState.user);
}
// logIn

async function setCurrentUser(data: ISignInResponse) {
    const newDate = setNewDate();
    appState.user.name = data.name;
    appState.user.userId = data.userId;
    appState.user.refreshToken = data.refreshToken;
    appState.user.token = data.token;
    const userInUserStats = isUserInUserStats(appState.user);
    const welcomeContainer = document.querySelector(".welcome-text");
    if (!isHTMLElement(welcomeContainer)) return;
    if (!data.name) {
        welcomeContainer.innerText = `Welcome stranger`;
    } else {
        welcomeContainer.innerText = `Welcome ${data.name} `;
    }
    if (!data.name) return;
    if(userInUserStats) {
        const id = `user${appState.user.userId}`
        const oldDate = (userInUserStats as IUserStatsInArr)[id].statisticTimeStamp;
        if(areDaysEqual((oldDate as string), newDate)) {
            appState.user.statsToday = (userInUserStats as IUserStatsInArr)[id];
        } else {
            const statsObj = await fetchUserStatistic();
            const modifiedObj = JSON.parse(JSON.stringify(statsObj));
            delete modifiedObj.id;
            if(!modifiedObj.optional) modifiedObj.optional = {};
            modifiedObj.optional[((userInUserStats as IUserStatsInArr)[id].statisticTimeStamp as string)] = (userInUserStats as IUserStatsInArr)[id].statisticState;
            modifiedObj.learnedWords += (userInUserStats as IUserStatsInArr)[id].statisticState.total.wordsLearnt;
            const body: IUserStatisticToDB = JSON.parse(JSON.stringify(modifiedObj));
            putUserStatistic(body);
            appState.usersStats.splice(appState.usersStats.indexOf(userInUserStats), 1);
            appState.user.statsToday = setEmptyStatistic(newDate);
            setUserStatsArr(appState.user);
        }
    } else {
        appState.user.statsToday = setEmptyStatistic(newDate);
    }
    const logOutBtn = document.querySelector(".logout-submit");
    if (!isHTMLButtonElement(logOutBtn)) return;
    logOutBtn.removeAttribute("disabled");
    getActiveViewData();
}

function validationHandler(nodeList: Node[]): boolean | undefined {
    let valid = true;
    const invalidEmail = document.querySelector(".invalid-email");
    if (!isHTMLElement(invalidEmail)) return undefined;
    const invalidPassword = document.querySelector(".invalid-password");
    if (!isHTMLElement(invalidPassword)) return undefined;
    const invalidName = document.querySelector(".invalid-name");
    if (!isHTMLElement(invalidName)) return undefined;
    const invalidPasswordRepeat = document.querySelector(".invalid-password-repeat");
    if (!isHTMLElement(invalidPasswordRepeat)) return undefined;
    invalidEmail.classList.add("hidden");
    invalidPassword.classList.add("hidden");
    invalidName.classList.add("hidden");
    invalidPasswordRepeat.classList.add('hidden');
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
    if(nodeList[3]) {
        if ((nodeList[3] as HTMLInputElement).value !== (nodeList[2] as HTMLInputElement).value) {
            valid = false;
            invalidPasswordRepeat.classList.remove('hidden');
        }
    }

    if (valid) {
        invalidEmail.classList.add("hidden");
        invalidPassword.classList.add("hidden");
        invalidName.classList.add("hidden");
        invalidPasswordRepeat.classList.add('hidden');
    }
    return valid;
}

function validateForm(form: string): boolean | undefined {
    let nameInput;
    let emailInput;
    let passwordInput;
    let repeatPasswordInput;
    let isValid: boolean | undefined = true;
    switch (form) {
        case "registration":
            nameInput = document.querySelector(".registration-name");
            if (!isHTMLInputElement(nameInput)) return undefined;
            passwordInput = document.querySelector(".registration-password");
            if (!isHTMLInputElement(passwordInput)) return undefined;
            emailInput = document.querySelector(".registration-email");
            if (!isHTMLInputElement(emailInput)) return undefined;
            repeatPasswordInput = document.querySelector(".registration-password-repeat");
            if (!isHTMLInputElement(repeatPasswordInput)) return undefined;
            isValid = validationHandler([emailInput, passwordInput, nameInput, repeatPasswordInput]);
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
            "Отказано в доступе, проверьте пароль.";
    } else if (message === "404") {
        messageContainer.innerText = "Мы не нашли такого пользователя, проверьте email";
    } else if (message === "417") {
        messageContainer.innerText = "Этот email уже используется";
    } else if (message === "422") {
        messageContainer.innerText = "Некорректный email или пароль";
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
    appState.isSignedIn = true;
    setCurrentUser(signedIn);
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
    appState.isSignedIn = true;
    setCurrentUser(signedIn);
    localStorage.setItem("appState", JSON.stringify(appState));
    passwordInput.value = "";
    emailInput.value = "";
}

export function logOutHandler(): void {
    Object.keys(appState.user).forEach((key) => {
        appState.user[key as keyof typeof appState.user] = "";
    });
    appState.user.statsToday = setEmptyStatistic('');
    appState.isSignedIn = false;
    localStorage.setItem("appState", JSON.stringify(appState));
    const welcomeContainer = document.querySelector(".welcome-text");
    if (!isHTMLElement(welcomeContainer)) return;
    welcomeContainer.innerText = `Welcome stranger`;
    const logOutBtn = document.querySelector(".logout-submit");
    if (!isHTMLButtonElement(logOutBtn)) return;
    logOutBtn.setAttribute("disabled", "true");
    getActiveViewData();
}

export function showFormHandler() {
    document.querySelector(".form-container")?.classList.toggle("hidden");
    const mainPageFormButtons = document.querySelector('.start-screen-buttons');
    if(!isHTMLDivElement(mainPageFormButtons)) return;
    [...mainPageFormButtons.children].forEach(elem=>{
        if(!document.querySelector(".form-container")?.classList.contains("hidden")) {
            elem.setAttribute('disabled', 'true');
        } else {
            elem.removeAttribute('disabled');
        };
    })
}

export function addFormHandlerToMainPage(e: Event){
    if (!isHTMLButtonElement(e.target)) return;
    e.target.setAttribute('disabled', 'true');
    const signIn = document.querySelector(".sign-in");
    if (!isHTMLElement(signIn)) return;
    const signUp = document.querySelector(".sign-up");
    if (!isHTMLElement(signUp)) return;
    const showSignInButton = document.querySelector('.show-sign-in');
    if (!isHTMLElement(showSignInButton)) return;
    const showSignUpButton = document.querySelector('.show-sign-up');
    if (!isHTMLElement(showSignUpButton)) return;
    if((e.target as HTMLButtonElement).classList.contains('sign-in-button')) {
        showFormHandler();
        showSignInButton.classList.add("active-form");
        showSignUpButton.classList.remove("active-form");
        signIn.classList.remove("hidden");
        signUp.classList.add("hidden");
        // if (!isHTMLButtonElement(e.target.nextElementSibling)) return;
        // e.target.nextElementSibling.setAttribute('disabled', 'true');
    } else if((e.target as HTMLButtonElement).classList.contains('registration-button')) {
        showFormHandler();
        showSignUpButton.classList.add("active-form");
        showSignInButton.classList.remove("active-form");
        signIn.classList.add("hidden");
        signUp.classList.remove("hidden");
    }



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

export function setLocalStorage() {
    localStorage.clear();
    localStorage.setItem("appState", JSON.stringify(appState));
}

export function getLocalStorage() {
    if (localStorage.getItem("appState")) {
        const newDate = new Date().toJSON();
        const {isSignedIn, user, view, viewsStates, userNull, usersStats} = JSON.parse(
            localStorage.appState
        );
        appState.isSignedIn = isSignedIn;
        appState.viewsStates = viewsStates;
        appState.user = user;
        appState.view = view;
        appState.userNull = userNull;
        appState.usersStats = usersStats;

        if (!appState.isSignedIn) {
            if (!JSON.parse(localStorage.appState).userNull.statisticTimeStamp) {
                appState.userNull = setEmptyStatistic(newDate);
                return;
            }
            const oldDate = JSON.parse(localStorage.appState).userNull.statisticTimeStamp;
            if (!areDaysEqual(oldDate, newDate)) {
                appState.userNull = setEmptyStatistic(newDate);
            } else {
                appState.userNull.statisticTimeStamp = oldDate;
                appState.userNull.statisticState = JSON.parse(localStorage.appState).userNull.statisticState;
            }
        }
    }
}

// games

export function keyboardEventsHandler(e: Event) {
    const gameContainer = document.querySelector('.game-popup');
    if(!isHTMLDivElement(gameContainer)) return;
    const nextButton = gameContainer.querySelector('.next-button');
    if(!isHTMLElement(nextButton)) return;
    if((currentGame.game as AudioCall).currentSlide === undefined) return;
    const currentSlide = gameContainer.querySelector((`.audio-call>div:nth-child(${(currentGame.game as AudioCall).currentSlide + 1})`));
    if(!isHTMLDivElement(currentSlide)) return;
    const buttonsContainer = currentSlide.querySelector('.answers-container');
    if(!isHTMLDivElement(buttonsContainer)) return;
    const playButton = currentSlide.querySelector('.play-button');
    if(!isHTMLButtonElement(playButton)) return;
    const answerOne = (buttonsContainer?.querySelector('button:nth-child(1)'));
    const answerTwo = (buttonsContainer?.querySelector('button:nth-child(2)'));
    const answerThree = (buttonsContainer?.querySelector('button:nth-child(3)'));
    const answerFour = (buttonsContainer?.querySelector('button:nth-child(4)'));
    if(!isHTMLButtonElement(answerOne) ||
     !isHTMLButtonElement(answerTwo) ||
     !isHTMLButtonElement(answerThree) ||
     !isHTMLButtonElement(answerFour) ) return;
    switch ((e as KeyboardEvent).key) {
        case String(KeyboardCodes.one):
            answerOne.click();
            break;
        case String(KeyboardCodes.two):
            answerTwo.click();
            break;
        case String(KeyboardCodes.three):
            answerThree.click();
            break;
        case String(KeyboardCodes.four):
            answerFour.click();
            break;
        case String(KeyboardCodes.enter):
            playButton.click();
            break;
        case String(KeyboardCodes.arrowRight):
            nextButton.click();
            break;
        default: break;
    }
}

export function closeGameOnPressESC(e: Event) {
    const closeGameButton = document.querySelector('.game-popup .close-button');
    if(!closeGameButton) return;
    if((e as KeyboardEvent).keyCode === 27) {
        (closeGameButton as HTMLDivElement).click();
    }
}

export function moveGameSlider(
    sliderContainer: HTMLElement,
    nextButton: HTMLElement
) {
    const innerSliderContainer = sliderContainer;
    if ((Number(innerSliderContainer.style.left.split("%")[0])) !== -(Number(innerSliderContainer.style.width.split("%")[0])) + 100) {
        innerSliderContainer.style.left = `${
            Number(innerSliderContainer.style.left.split("%")[0]) - 100
        }%`;
    } else {
        innerSliderContainer.style.left = `${
            Number(innerSliderContainer.style.left.split("%")[0]) - 100
        }%`;
        const container = sliderContainer.closest(".game-popup");
        if (!isHTMLElement(container)) return;
        container
            .querySelector(".game-stats-wrapper")
            ?.classList.remove("opacity-hidden");
        nextButton.setAttribute("disabled", "true");
        document.removeEventListener('keydown', keyboardEventsHandler);
    }
}

export function playWordInGameHandler(audio: HTMLAudioElement) {
    audio.play();
}

function stopPlayingWordHandler(audio: HTMLAudioElement) {
    audio.pause();
}

export async function modifyWord(game: AudioCall, word: IAggreagtedWord)  {
    const body: IUserWord = getUserWord(word);
    if(!body) return;
    body.optional.audiocall.countGames += 1;
    if(game.state.answers.true.find(id => id === word.id)) {
        body.optional.audiocall.rightAnswer += 1;
        body.optional.audiocall.rightAnswerSeries += 1;
        if (body.difficulty === 'hard') {
            if(body.optional.audiocall.rightAnswerSeries >= 5) {
                body.difficulty = 'easy';
            }
        }
        if (body.difficulty === 'norm') {
            if(body.optional.audiocall.rightAnswerSeries >= 3) {
                body.difficulty = 'easy';
            }
        }
    } else if(game.state.answers.false.find(id => id === word.id)) {
        body.optional.audiocall.rightAnswerSeries = 0;
        body.difficulty = 'hard';
    } else {
        return;
    }
    await fetchPostOrPutUserWord({
        word,
        modifyedUserWord: body
    })
}

export function startGame(
    container: HTMLElement,
    section: number,
    game: string,
    page: number,
    arrOfWords?: IResWordsPage,
) {
    let popup: HTMLElement;
    if(!arrOfWords) {
        popup = new GamePopUp().create(section, page, game);
    } else {
        popup = new GamePopUp().create(section, page, game, arrOfWords);
    }
    container.append(popup);
    document.addEventListener('keydown', closeGameOnPressESC);
    // document.addEventListener('keydown', keyboardEventsHandler);
    const closeButton = container.querySelector(".close-button");
    if (!isHTMLElement(closeButton)) return;
    closeButton.addEventListener("click", async () => {
        if(!appState.isSignedIn) {
            setStats((currentGame.game as AudioCall), appState.userNull);
        } else {
            setStats((currentGame.game as AudioCall), (appState.user.statsToday as IUserStats));
        }
        if(appState.isSignedIn) {
            (currentGame.game as AudioCall).wordsInGame?.forEach((word) => {
                modifyWord((currentGame.game as AudioCall), word)
            })
        }

        currentGame.game = null;
        container.removeChild(popup);
        const overlay = document.querySelector('.overlay');
        overlay?.classList.add('hidden');
    });
    const nextButton = container.querySelector(".next-button");
    if (!isHTMLElement(nextButton)) return;
    nextButton.addEventListener("click", () => {
        const sliderContainer = popup.querySelector(".audio-call");
        (currentGame.game as AudioCall).currentSlide += 1;
        if (!isHTMLDivElement(sliderContainer)) return;
        moveGameSlider(sliderContainer, nextButton);
        const audio = sliderContainer.querySelector(
            `.word-card:nth-child(${
                (currentGame.game as AudioCall).currentSlide + 1
            })>audio`
        );
        const prevAudio = sliderContainer.querySelector(
            `.word-card:nth-child(${
                (currentGame.game as AudioCall).currentSlide
            })>audio`
        );
        stopPlayingWordHandler(prevAudio as HTMLAudioElement);
        if (!audio) return;
        playWordInGameHandler(audio as HTMLAudioElement);
    });
    const overlay = document.querySelector('.overlay');
    overlay?.classList.remove('hidden');
}

// eslint-disable-next-line func-names
export const pressKey = function(event: KeyboardEvent) {
    const arrayLeftKey = document.querySelector(".right-key");
    if(!isHTMLButtonElement(arrayLeftKey)) return;
    const arrayRightKey = document.querySelector(".wrong-key");
    if(!isHTMLButtonElement(arrayRightKey)) return;
    window.addEventListener('keydown', (e) => {
        if( e.code === "ArrowLeft") {
            arrayLeftKey.classList.add('active');
        }
        if( e.code === "ArrowRight") {
            arrayRightKey.classList.add('active');
        }
    });

    window.addEventListener('keyup', (e) => {
        if( e.code === "ArrowLeft") {
            arrayLeftKey.classList.remove('active');
        }
        if( e.code === "ArrowRight") {
            arrayRightKey.classList.remove('active');
        }
     });

    event.preventDefault();
    if( event.code === "ArrowLeft") {
        (currentGame.game as Sprint).onRightButton();
    } else if (event.code === "ArrowRight") {
        (currentGame.game as Sprint).onWrongButton();
    }
}

export function startGameHandler(e: Event, arrOfWords?: IResWordsPage): void {
    // const CALL_GAME = "Audio Call";
    // const SPRINT = 'Sprint';
    const {target} = e;
    const gameContainer = document.querySelector(".games");
    if (!isHTMLElement(gameContainer)) return;
    if (!isHTMLButtonElement(target)) return;
    if (!target.classList.contains("start-button")) return;
    if (target.classList.contains("sprint-button")) {
        const section = Number(target.closest('.game-container')?.querySelector('select')?.value);
        const page = getRandomInRange(TEXTBOOK_PAGE_COUNT);
        startGame(gameContainer, section, SPRINT, page);
        const timer = setTimeout(() => {(currentGame.game as Sprint).endGame()}, 61000);
        console.log(currentGame)
        const closeButton = document.querySelector(".close-button");
        if (!isHTMLElement(closeButton)) return;
        closeButton.addEventListener("click", () => { clearTimeout(timer) })
        document.removeEventListener("keydown", pressKey, false);
    } else {
        const section = Number(
            target.closest(".game-container")?.querySelector("select")?.value
        );
        const PAGE = getRandomInRange(TEXTBOOK_PAGE_COUNT);
        if(!arrOfWords) {
            startGame(gameContainer, section, AUDIO_CALL, PAGE);
        } else {
            startGame(gameContainer, section, AUDIO_CALL, PAGE, arrOfWords);
        }
    }
}


export function playAgainHandler(gameContainer: HTMLElement, section: number){
    if(!appState.isSignedIn) {
        setStats((currentGame.game as AudioCall), appState.userNull);
      } else {
          setStats((currentGame.game as AudioCall), (appState.user.statsToday as IUserStats));
          (currentGame.game as AudioCall).wordsInGame?.forEach((word) => {
            modifyWord((currentGame.game as AudioCall), word)
        })
      }
      currentGame.game = null;
      const CALL_GAME = 'Audio Call';
      const PAGE = getRandomInRange(TEXTBOOK_PAGE_COUNT);
      const container = document.querySelector('.games');
      if(!isHTMLElement(container)) return;
      container.removeChild(gameContainer);
      startGame(container, section, CALL_GAME, PAGE);
}

export function getGameWordsArr(arr: WordsData) {
    const output: IAggreagtedWord[] = [];
    if(arr.length >= 10) {
        while (output.length < 10) {
            const ind = getRandomInRange(arr.length);
            if (!output.includes(arr[ind])) output.push(arr[ind]);
        }
    } else {
        while (output.length < arr.length) {
            const ind = getRandomInRange(arr.length);
            if (!output.includes(arr[ind])) output.push(arr[ind]);
            console.log(output)
        }
    }
    return output;
}

export function getOptions(arr: string[], word: string) {
    const options = [word];
    while (options.length < 4) {
        const ind = getRandomInRange(arr.length);
        if (!options.includes(arr[ind])) options.push(arr[ind]);
    }
    options.sort(() => (Math.random() > 0.5 ? 1 : -1));
    return options;
}

function createAnswerCardInner(answer: string, container: HTMLElement) {
    const word = (currentGame.game as AudioCall).wordsInGame?.find(
        (wordObj: IAggreagtedWord) => wordObj.id === answer
    );
    const answerCard = createElementWithClassnames("div", "answer-card");
    const play = createElementWithClassnames("button", "audio-play");
    const audioAttr = {
        src: `${ENDPOINT}/${word?.audio}`,
        type: "audio/mpeg",
    };
    const audio = createElementWithAttributes("audio", audioAttr);
    play.addEventListener("click", () => {
        playWordInGameHandler(audio as HTMLAudioElement);
    });
    const wordTag = createElementWithContent("p", word?.word as string);
    wordTag.classList.add("answer-word");
    const transcriptionTag = createElementWithContent(
        "p",
        word?.transcription as string
    );
    transcriptionTag.classList.add("answer-transcription");
    const translationTag = createElementWithContent(
        "p",
        word?.wordTranslate as string
    );
    translationTag.classList.add("answer-translation");
    answerCard.append(play, audio, wordTag, transcriptionTag, translationTag);
    container.append(answerCard);
}

export function createAnswersCards(key: boolean, container: HTMLElement) {
    if (key === true) {
        (currentGame.game as AudioCall).state.answers.true.forEach((answer) => {
            createAnswerCardInner(answer, container);
        });
    } else {
        (currentGame.game as AudioCall).state.answers.false.forEach(
            (answer) => {
                createAnswerCardInner(answer, container);
            }
        );
    }
}

function addToCurrentGameState(guess: boolean, wordID: string) {
    if (guess) {
        // (currentGame.game as AudioCall).state.correctGuesses += 1;
        (currentGame.game as AudioCall).state.currentStrick += 1;
        if (
            (currentGame.game as AudioCall).state.currentStrick >
            (currentGame.game as AudioCall).state.maxStrick
        ) {
            (currentGame.game as AudioCall).state.maxStrick = (currentGame.game as AudioCall).state.currentStrick;
        }
        (currentGame.game as AudioCall).state.answers.true.push(wordID);
    } else {
        (currentGame.game as AudioCall).state.currentStrick = 0;
        (currentGame.game as AudioCall).state.answers.false.push(wordID);
    }
}

export function appendGameStats(wrapper: HTMLElement) {
    wrapper.append(new GameStats().create());
    return wrapper;
}

export function choseAnswerHandler(e: Event, answer: string) {
    const {target} = e;
    if (!isHTMLButtonElement(target)) return;
    const container = target.closest(".game-popup");
    if (!isHTMLDivElement(container)) return;
    const wrongSound = container.querySelector(".wrong-sound");
    if (!isHTMLElement(wrongSound)) return;
    const correctSound = container.querySelector(".correct-sound");
    if (!isHTMLElement(wrongSound)) return;
    const card = target.closest(".word-card");
    if (!isHTMLDivElement(card)) return;
    const flipContainer = card.querySelector(".flip-container");
    if (!isHTMLDivElement(flipContainer)) return;
    flipContainer.classList.add("answered");
    const img = card.querySelector("img");
    if (!isHTMLElement(img)) return;
    const answerButtons = card.querySelectorAll(".option");
    const correctAnswer = card.querySelector(".answer");
    if (!isHTMLElement(correctAnswer)) return;
    const wordId = card.getAttribute("data-id");
    if (target.getAttribute("data-option") !== answer) {
        (wrongSound as HTMLAudioElement).play();
        target.classList.add("incorrect-answer");
        answerButtons.forEach((button) => {
            if (button.getAttribute("data-option") === answer)
                button.classList.add("correct-answer");
            (button as HTMLButtonElement).setAttribute("disabled", "true");
        });
        addToCurrentGameState(false, wordId as string);
    } else {
        target.classList.add("correct-answer");
        (correctSound as HTMLAudioElement).play();
        answerButtons.forEach((button) => {
            (button as HTMLButtonElement).setAttribute("disabled", "true");
        });
        addToCurrentGameState(true, wordId as string); // !TODO
    }
    correctAnswer.classList.remove("opacity-hidden");
    const statsCurrentContainer = document.querySelector(".game-stats-wrapper");
    if (!isHTMLElement(statsCurrentContainer)) return;
    const statsOld = statsCurrentContainer.querySelector(".game-stats");
    if (!isHTMLElement(statsOld)) return;
    statsOld.replaceChildren();
    const statsNew = appendGameStats(statsOld);
    statsCurrentContainer.replaceChild(statsOld, statsNew);
}
export function choseSplitAnswerHandler(e: Event) {
    const {target} = e;
    if (!isHTMLButtonElement(target)) return;
    if(target.classList.contains("yes-button")) {
        (currentGame.game as Sprint).onRightButton();
    } else if (target.classList.contains("no-button")) {
        (currentGame.game as Sprint).onWrongButton();
    }
}

export function getRandomNumber(number: number) {
    return Math.floor(Math.random() * number);
}

export function getColor(): string {
    let color = "";
    if (appState.viewsStates.textbook.mode === "textbook") {
        color = COLORS[appState.viewsStates.textbook.group];
    } else if (appState.viewsStates.textbook.dictionaryMode === "hard") {
        color = "crimson";
    } else if (appState.viewsStates.textbook.dictionaryMode === "norm") {
        color = "orange";
    } else if (appState.viewsStates.textbook.dictionaryMode === "easy") {
        color = "yellowgreen";
    }
    return color;
}