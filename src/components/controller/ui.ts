/* eslint-disable no-param-reassign */
import {IAggreagtedWord} from "../../typings";
import {postUser, logIn, setTexbookStateWords} from "./api";
import {
    appState,
    currentGame,
    TEXTBOOK_PAGE_COUNT,
    ENDPOINT,
    WORDS_IN_GAME,
    COLORS,
} from "./state";
import {
    isHTMLButtonElement,
    isHTMLElement,
    isHTMLDivElement,
    isHTMLInputElement,
} from "../../typings/utils/utils";
import {ISignInResponse, WordsData, IUser, IUserStats, IUserStatsInArr, IWordLearningState, KeyboardCodes} from "../../typings/typings";
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
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
            },
            audioCall: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
            },
            sprint: {
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0
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

export function calcCorrectAnswersPercent(numberOfGames: number, answers: number) {
    return Math.floor((Number(answers) * 100) / (Number(numberOfGames) * WORDS_IN_GAME));
}


export function setStats(game: AudioCall, user: IUserStats) { // !TODO тут в типы добавить 2ю игру, когда появится
    user.statisticState.total.correctAnswers += game.state.answers.true.length;
    user.statisticState.audioCall.correctAnswers += game.state.answers.true.length;
    if(user.statisticState.audioCall.correctAnswersStrick < game.state.maxStrick) {
        user.statisticState.audioCall.correctAnswersStrick = game.state.maxStrick;
    }
    const AUDIO_CALL = 'audioCall';
    (currentGame.game as AudioCall).state.answers.true.forEach(word => {
        const wordInWordsLearnt = isWordInWordsLearnt(word, user, AUDIO_CALL);
        if(!wordInWordsLearnt) {
            const wordOnLearning: IWordLearningState = {};
            wordOnLearning[word] = 1
            user.statisticState.audioCall.wordsLearntArr.push((wordOnLearning));
        } else {
            wordInWordsLearnt[word] += 1;
            if(wordInWordsLearnt[word] === 3) {
                user.statisticState.audioCall.wordsLearnt += 1
            }
            if(wordInWordsLearnt[word] > 3) {
                wordInWordsLearnt[word] = 3;
            }
        }
    });
    (currentGame.game as AudioCall).state.answers.false.forEach(word => {
        const wordInWordsLearnt = isWordInWordsLearnt(word, user, AUDIO_CALL);
        if(wordInWordsLearnt) {
            wordInWordsLearnt[word] = 0;
            if (user.statisticState.audioCall.wordsLearnt > 0) {
                user.statisticState.audioCall.wordsLearnt -= 1
            } else {
                user.statisticState.audioCall.wordsLearnt = 0;
            }
        }
    })
    user.statisticState.total.wordsLearnt = user.statisticState.audioCall.wordsLearnt + user.statisticState.sprint.wordsLearnt;
    user.statisticState.audioCall.numberOfGames += 1;
    user.statisticState.audioCall.correctAnswersPercent = calcCorrectAnswersPercent(
        user.statisticState.audioCall.numberOfGames,
        user.statisticState.audioCall.correctAnswers
    )
    user.statisticState.total.correctAnswersPercent = calcCorrectAnswersPercent(
        user.statisticState.audioCall.numberOfGames + user.statisticState.sprint.numberOfGames,
        user.statisticState.audioCall.correctAnswers + user.statisticState.sprint.correctAnswers
    )
    if(!appState.isSignedIn) return;
    setUserStatsArr(appState.user);
}
// logIn

function setCurrentUser(data: ISignInResponse) {
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
            appState.user.statsToday = setEmptyStatistic(newDate);
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

function keyboardEventsHandler(e: Event) {
    const gameContainer = document.querySelector('.game-popup');
    if(!isHTMLDivElement(gameContainer)) return;
    const nextButton = gameContainer.querySelector('.next-button');
    if(!isHTMLElement(nextButton)) return;
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
    if (sliderContainer.style.left !== "-900%") {
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


export function startGame(
    container: HTMLElement,
    section: number,
    game: string,
    page: number
) {
    const startButtons = document.querySelectorAll('.start-button');
    startButtons.forEach(button=> {
        button.setAttribute('disabled', 'true');
    })
    const popup = new GamePopUp().create(section, game, page);
    container.append(popup);
    document.addEventListener('keydown', closeGameOnPressESC);
    document.addEventListener('keydown', keyboardEventsHandler);
    const closeButton = container.querySelector(".close-button");
    if (!isHTMLElement(closeButton)) return;
    closeButton.addEventListener("click", () => {
        if(!appState.isSignedIn) {
            setStats((currentGame.game as AudioCall), appState.userNull);
        } else {
            setStats((currentGame.game as AudioCall), (appState.user.statsToday as IUserStats));
        }

        currentGame.game = null;
        container.removeChild(popup);
        startButtons.forEach(button=> {
            button.removeAttribute('disabled');
        })
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

export function startGameHandler(e: Event): void {
    const CALL_GAME = "Audio Call";
    const SPRINT = "Sprint";
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
        const closeButton = document.querySelector(".close-button");
        if (!isHTMLElement(closeButton)) return;
        closeButton.addEventListener("click", () => { clearTimeout(timer) }) 
        document.removeEventListener("keydown", pressKey, false);   
    } else {
        const section = Number(
            target.closest(".game-container")?.querySelector("select")?.value
        );
        const page = getRandomInRange(TEXTBOOK_PAGE_COUNT);
        startGame(gameContainer, section, CALL_GAME, page);
    } 
}


export function playAgainHandler(gameContainer: HTMLElement, section: number){
    if(!appState.isSignedIn) {
        setStats((currentGame.game as AudioCall), appState.userNull);
      } else {
          setStats((currentGame.game as AudioCall), (appState.user.statsToday as IUserStats));
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
    while (output.length < 10) {
        const ind = getRandomInRange(arr.length);
        if (!output.includes(arr[ind])) output.push(arr[ind]);
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

function addToCurrentGameState(guess: boolean, wordId: string) {
    if (guess) {
        // (currentGame.game as AudioCall).state.correctGuesses += 1;
        (currentGame.game as AudioCall).state.currentStrick += 1;
        if (
            (currentGame.game as AudioCall).state.currentStrick >
            (currentGame.game as AudioCall).state.maxStrick
        ) {
            (currentGame.game as AudioCall).state.maxStrick = (currentGame.game as AudioCall).state.currentStrick;
        }
        (currentGame.game as AudioCall).state.answers.true.push(wordId);
    } else {
        (currentGame.game as AudioCall).state.currentStrick = 0;
        (currentGame.game as AudioCall).state.answers.false.push(wordId);
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