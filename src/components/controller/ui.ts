/* eslint-disable no-param-reassign */
import {Chart, ChartItem, registerables} from "chart.js";
import {IAggreagtedWord} from "../../typings";
import {
    postUser,
    logIn,
    setTexbookStateWords,
    putUserStatistic,
    fetchPostOrPutUserWord,
    fetchUserStatistic,
    getUserWord,
} from "./api";
import {
    appState,
    currentGame,
    TEXTBOOK_PAGE_COUNT,
    ENDPOINT,
    COLORS,
    AUDIO_CALL,
    SPRINT,
} from "./state";
import {
    isHTMLButtonElement,
    isHTMLElement,
    isHTMLDivElement,
    isHTMLInputElement,
} from "../../typings/utils/utils";

import {
    ISignInResponse,
    WordsData,
    IUser,
    IUserStats,
    IUserStatsInArr,
    KeyboardCodes,
    IUserWord,
    IUserStatisticToDB,
    IResWordsPage,
    IStatisticState,
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
import {Sprint} from "../view/audio-call/sprint/sprint-model";
import {getRouteHandlerFromMain} from "./routing";

function clearFormFields(formName: string) {
    const emailInput = document.querySelector(`.${formName}-email`);
    if (!isHTMLInputElement(emailInput)) return;
    emailInput.value = "";
    const passwordInput = document.querySelector(`.${formName}-password`);
    if (!isHTMLInputElement(passwordInput)) return;
    passwordInput.value = "";
    const nameInput = document.querySelector(`.${formName}-name`);
    if (!isHTMLInputElement(nameInput)) return;
    nameInput.value = "";
    const passwordInputRepeat = document.querySelector(
        `.${formName}-password-repeat`
    );
    if (!isHTMLInputElement(passwordInputRepeat)) return;
    passwordInputRepeat.value = "";
}

export function showFormHandler() {
    document.querySelector(".form-container")?.classList.toggle("hidden");
    const mainPageFormButtons = document.querySelector(".start-screen-buttons");
    clearFormFields("registration");
    clearFormFields("login");
    if (!isHTMLDivElement(mainPageFormButtons)) return;
    [...mainPageFormButtons.children].forEach((elem) => {
        if (
            !document
                .querySelector(".form-container")
                ?.classList.contains("hidden")
        ) {
            elem.setAttribute("disabled", "true");
        } else {
            elem.removeAttribute("disabled");
        }
    });
}

export function addFormHandlerToMainPage(e: Event) {
    if (!isHTMLButtonElement(e.target)) return;
    e.target.setAttribute("disabled", "true");
    const signIn = document.querySelector(".sign-in");
    if (!isHTMLElement(signIn)) return;
    const signUp = document.querySelector(".sign-up");
    if (!isHTMLElement(signUp)) return;
    const showSignInButton = document.querySelector(".show-sign-in");
    if (!isHTMLElement(showSignInButton)) return;
    const showSignUpButton = document.querySelector(".show-sign-up");
    if (!isHTMLElement(showSignUpButton)) return;
    if ((e.target as HTMLButtonElement).classList.contains("sign-in-button")) {
        showFormHandler();
        showSignInButton.classList.add("active-form");
        showSignUpButton.classList.remove("active-form");
        signIn.classList.remove("hidden");
        signUp.classList.add("hidden");
    } else if (
        (e.target as HTMLButtonElement).classList.contains(
            "registration-button"
        )
    ) {
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
    if (appState.view === "textbook") {
        PagePagination.moveSlider();
    }
    if (appState.view === "index") {
        const startScreenButtons = document.querySelector(
            ".start-screen-buttons"
        );
        if (!isHTMLElement(startScreenButtons)) return;
        startScreenButtons.addEventListener("click", addFormHandlerToMainPage);
        const navigationFromMain = document.querySelectorAll(".benefits-img");
        navigationFromMain.forEach((linkFromMain) => {
            linkFromMain.addEventListener("click", getRouteHandlerFromMain);
            linkFromMain.addEventListener("click", (e: Event) => {
                const {target} = e;
                if (!isHTMLElement(target)) return;
                if (!target.classList.contains("benefits-img")) return;
                const link = target.getAttribute("href");
                if (!link) return;
                getActiveViewData();
            });
        });
    }
}

// stats
Chart.register(...registerables);

export function setDailyChart(chart: HTMLCanvasElement, data: number[]) {
    const ctx = (chart as HTMLCanvasElement).getContext("2d");
    const myChart = new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: {
            labels: [`% ???????????????????? ?????????????? ???? ??????????????`, `% ???????????????????????? ??????????????`],
            datasets: [
                {
                    data,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
    });
    return myChart;
}

export function isUserInUserStats(user: IUser) {
    const id = `user${user.userId}`;

    return (
        appState.usersStats.find(
            (elem) => Object.keys(elem as IUserStats)[0] === id
        ) || false
    );
}

export function setEmptyStatistic(str: string) {
    return {
        statisticTimeStamp: str,
        statisticState: {
            total: {
                newWords: 0,
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
                totalAnswers: 0,
            },
            audioCall: {
                newWords: 0,
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
                totalAnswers: 0,
            },
            sprint: {
                newWords: 0,
                correctAnswersPercent: 0,
                numberOfGames: 0,
                wordsLearntArr: [],
                wordsLearnt: 0,
                correctAnswers: 0,
                correctAnswersStrick: 0,
                totalAnswers: 0,
            },
        },
    };
}

function setTodayUserStatsForGraph() {
    const stats = isUserInUserStats(appState.user);
    if(!Object.entries((stats as IUserStats))[0]
    || !Object.entries((stats as IUserStats))[0]
    || !Object.entries((stats as IUserStats))[0]) return {
        date: '',
        newWords: 0,
        wordsLearnt: 0
    };

    const date = Object.entries((stats as IUserStats))[0][1].statisticTimeStamp;
    const {newWords} = Object.entries((stats as IUserStats))[0][1].statisticState.total;
    const {wordsLearnt} = Object.entries((stats as IUserStats))[0][1].statisticState.total;
    return {
        date,
        newWords,
        wordsLearnt
    }
}

export function setLongTermGraph(chart: HTMLCanvasElement, data:{ string?: number[] | undefined}[]| undefined) {
    if(!data) return;
    const arrOfDates: string[] = [];
    const arrOfLearntWords: number[] = [];
    const arrOfnewWords: number[] = [];
    data.forEach(item=>{
        const entries = Object.entries(item);
        arrOfDates.push((entries[0][0] as unknown as string));
        arrOfnewWords.push((entries[0][1][0] as unknown as number));
        arrOfLearntWords.push((entries[0][1][1] as unknown as number));
    })
    const ctx = (chart as HTMLCanvasElement).getContext("2d");
    /* eslint-disable @typescript-eslint/no-unused-vars */
    try {
        const myChart = new Chart(ctx as ChartItem, {
            data: {
                datasets: [{
                    type: 'bar',
                    label: '?????????? ??????????',
                    data: arrOfnewWords,
                    backgroundColor: [
                        "rgba(54, 162, 235, 0.6)",
                    ],
                }, {
                    type: 'line',
                    label: '?????????????????? ??????????',
                    data: arrOfLearntWords,
                    backgroundColor: [
                        "rgba(255, 99, 132, 1)",
                    ],
                }],
                labels: arrOfDates
            },
        });
    } catch (err) {
        console.log(JSON.stringify(err))
    }
}

export function compareDates(oldDate: string, newDate: string){
    [oldDate] = oldDate.split("T");
    [newDate] = newDate.split("T");
    if (Date.parse(oldDate) === Date.parse(newDate)) return true;
    return false;
}

export async function processLongStats(): Promise<{ string?: number[] | undefined}[] | undefined> {
    if(!appState.isSignedIn) return undefined;
    const statsToday = setTodayUserStatsForGraph();
    let dataArr= [];
    let dayToday: string;
    if(statsToday.date && (statsToday.newWords || statsToday.wordsLearnt)) {
        dayToday = new Date(statsToday.date.split("T")[0]).toUTCString().split(',')[1].slice(0, 12);
        const todayObj: {string?: number[]} = {};
        todayObj[dayToday as keyof typeof todayObj] = [(statsToday.newWords as number), statsToday.wordsLearnt];
        dataArr.push(todayObj);
    }
    const statsObj = await fetchUserStatistic();
    const longTermStats = await statsObj.optional;
    if(!longTermStats) return dataArr;
    Object.entries(longTermStats).forEach((item)=>{
        const day = new Date(item[0].split("T")[0]).toUTCString().split(',')[1].split('00:00:00')[0].trim();
        if(dayToday) {
            if(compareDates(dayToday, day)) {
                const statsObjDays: {string?: number[]} = {};
                statsObjDays[day as unknown as keyof typeof statsObjDays] = [(((item[1] as IStatisticState).total.newWords) + ((appState.user.statsToday as IUserStats).statisticState.total.newWords)), ((item[1] as unknown as IStatisticState).total.wordsLearnt + (appState.user.statsToday as IUserStats).statisticState.total.newWords)];
            } else {
                const statsObjDays: {string?: number[]} = {};
                statsObjDays[day as unknown as keyof typeof statsObjDays] = [(item[1] as IStatisticState).total.newWords, (item[1] as unknown as IStatisticState).total.wordsLearnt];
                dataArr.push(statsObjDays);
            }
        } else {
            const statsObjDays: {string?: number[]} = {};
            statsObjDays[day as unknown as keyof typeof statsObjDays] = [(item[1] as IStatisticState).total.newWords, (item[1] as unknown as IStatisticState).total.wordsLearnt];
            dataArr.push(statsObjDays);
        }
    })
    dataArr = dataArr.sort((a, b) => (Date.parse(Object.keys(a)[0])) - (Date.parse(Object.keys(b)[0])))
    return dataArr;

}



function setNewDate() {
    return new Date().toJSON();
}

function setUserStatsArr(user: IUser) {
    const userInUserStats = isUserInUserStats(user);
    if (!userInUserStats) {
        const id = `user${user.userId}`;
        const newUser: IUserStatsInArr = {};
        newUser[id] = user.statsToday as IUserStats;
        appState.usersStats.push(newUser);
    }
}

export function calcCorrectAnswersPercent(
    answers: number,
    wordsInGames: number
) {
    return Math.floor((Number(answers) * 100) / wordsInGames);
}

function setGameStatisticToStats(
    game: AudioCall | Sprint,
    user: IUserStats,
    gameState: AudioCall["state"] | Sprint["state"],
    usersStats: IUserStats["statisticState"],
    gameName: string
) {
    usersStats[gameName as keyof typeof usersStats].correctAnswers +=
        gameState.answers.true.length;
    if (
        usersStats[gameName as keyof typeof usersStats].correctAnswersStrick <
        gameState.maxStrick
    ) {
        usersStats[gameName as keyof typeof usersStats].correctAnswersStrick =
            gameState.maxStrick;
    }
    usersStats[gameName as keyof typeof usersStats].numberOfGames += 1;
    const totalWordsInGames =
        game.state.answers.false.length + game.state.answers.true.length;
    usersStats[
        gameName as keyof typeof usersStats
    ].totalAnswers += totalWordsInGames;
    if (usersStats[gameName as keyof typeof usersStats].totalAnswers) {
        usersStats[
            gameName as keyof typeof usersStats
        ].correctAnswersPercent = calcCorrectAnswersPercent(
            usersStats[gameName as keyof typeof usersStats].correctAnswers,
            usersStats[gameName as keyof typeof usersStats].totalAnswers
        );
    } else {
        usersStats[
            gameName as keyof typeof usersStats
        ].correctAnswersPercent = 0;
    }
}

export async function setStats(game: AudioCall | Sprint, user: IUserStats) {
    if (game instanceof AudioCall) {
        setGameStatisticToStats(
            game,
            user,
            game.state,
            user.statisticState,
            AUDIO_CALL
        );
    } else {
        setGameStatisticToStats(
            game,
            user,
            game.state,
            user.statisticState,
            SPRINT
        );
    }
    user.statisticState.total.correctAnswers += game.state.answers.true.length;
    user.statisticState.total.wordsLearnt =
        user.statisticState.audioCall.wordsLearnt +
        user.statisticState.sprint.wordsLearnt;
    user.statisticState.total.numberOfGames += 1;
    const totalWordsInGames =
        user.statisticState.audioCall.totalAnswers +
        user.statisticState.sprint.totalAnswers;
    if (totalWordsInGames) {
        user.statisticState.total.correctAnswersPercent = calcCorrectAnswersPercent(
            user.statisticState.total.correctAnswers,
            totalWordsInGames
        );
    } else {
        user.statisticState.total.correctAnswersPercent = 0;
    }
    if (!appState.isSignedIn) return;
    setUserStatsArr(appState.user);
}
// logIn

export function setEmptyUserStatisticForDB(): IUserStatisticToDB{
    return {
        learnedWords: 0,
        optional: {}
    }
}

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
        appState.isSignedIn = true;
        try {
            await fetchUserStatistic();
        } catch (err) {
            console.log((err as Error).message);
            const body = setEmptyUserStatisticForDB();
            putUserStatistic(body);
        }
    }
    if (!data.name) return;
    if (userInUserStats) {
        const id = `user${appState.user.userId}`;
        const oldDate = (userInUserStats as IUserStatsInArr)[id]
            .statisticTimeStamp;
        if (compareDates(oldDate as string, newDate)) {
            appState.user.statsToday = (userInUserStats as IUserStatsInArr)[id];
        } else {
            const statsObj = await fetchUserStatistic();
            const modifiedObj = JSON.parse(JSON.stringify(statsObj));
            delete modifiedObj.id;
            if (!modifiedObj.optional) modifiedObj.optional = {};
            modifiedObj.optional[
                (userInUserStats as IUserStatsInArr)[id]
                    .statisticTimeStamp as string
            ] = (userInUserStats as IUserStatsInArr)[id].statisticState;
            modifiedObj.learnedWords += (userInUserStats as IUserStatsInArr)[
                id
            ].statisticState.total.wordsLearnt;
            const body: IUserStatisticToDB = JSON.parse(
                JSON.stringify(modifiedObj)
            );
            putUserStatistic(body);
            appState.usersStats.splice(
                appState.usersStats.indexOf(userInUserStats),
                1
            );
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
    const invalidPasswordRepeat = document.querySelector(
        ".invalid-password-repeat"
    );
    if (!isHTMLElement(invalidPasswordRepeat)) return undefined;
    invalidEmail.classList.add("hidden");
    invalidPassword.classList.add("hidden");
    invalidName.classList.add("hidden");
    invalidPasswordRepeat.classList.add("hidden");
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
    if (nodeList[3]) {
        if (
            (nodeList[3] as HTMLInputElement).value !==
            (nodeList[1] as HTMLInputElement).value
        ) {
            valid = false;
            invalidPasswordRepeat.classList.remove("hidden");
        }
    }

    if (valid) {
        invalidEmail.classList.add("hidden");
        invalidPassword.classList.add("hidden");
        invalidName.classList.add("hidden");
        invalidPasswordRepeat.classList.add("hidden");
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
            repeatPasswordInput = document.querySelector(
                ".registration-password-repeat"
            );
            if (!isHTMLInputElement(repeatPasswordInput)) return undefined;
            isValid = validationHandler([
                emailInput,
                passwordInput,
                nameInput,
                repeatPasswordInput,
            ]);
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
        messageContainer.innerText = "???????????????? ?? ??????????????, ?????????????????? ????????????.";
    } else if (message === "404") {
        messageContainer.innerText =
            "???? ???? ?????????? ???????????? ????????????????????????, ?????????????????? email";
    } else if (message === "417") {
        messageContainer.innerText = "???????? email ?????? ????????????????????????";
    } else if (message === "422") {
        messageContainer.innerText = "???????????????????????? email ?????? ????????????";
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
        clearFormFields("registration");
    } else if (e.target.classList.contains("show-sign-up")) {
        e.target.classList.add("active-form");
        if (!isHTMLButtonElement(e.target.previousElementSibling)) return;
        e.target.previousElementSibling.classList.remove("active-form");
        signIn.classList.add("hidden");
        signUp.classList.remove("hidden");
        clearFormFields("login");
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
    const passwordInputRepeat = document.querySelector(
        ".registration-password-repeat"
    );
    if (!isHTMLInputElement(passwordInputRepeat)) return;
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
    clearFormFields("registration");
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
    clearFormFields("login");
}

export function logOutHandler(): void {
    Object.keys(appState.user).forEach((key) => {
        appState.user[key as keyof typeof appState.user] = "";
    });
    appState.user.statsToday = setEmptyStatistic("");
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

export function setLocalStorage() {
    localStorage.clear();
    localStorage.setItem("appState", JSON.stringify(appState));
}

export function getLocalStorage() {
    if (localStorage.getItem("appState")) {
        const newDate = new Date().toJSON();
        const {
            isSignedIn,
            user,
            view,
            viewsStates,
            userNull,
            usersStats,
        } = JSON.parse(localStorage.appState);
        appState.isSignedIn = isSignedIn;
        appState.viewsStates = viewsStates;
        appState.user = user;
        appState.view = view;
        appState.userNull = userNull;
        appState.usersStats = usersStats;

        if (!appState.isSignedIn) {
            if (
                !JSON.parse(localStorage.appState).userNull.statisticTimeStamp
            ) {
                appState.userNull = setEmptyStatistic(newDate);
                return;
            }
            const oldDate = JSON.parse(localStorage.appState).userNull
                .statisticTimeStamp;
            if (!compareDates(oldDate as string, newDate)) {
                appState.userNull = setEmptyStatistic(newDate);
            } else {
                appState.userNull.statisticTimeStamp = oldDate;
                appState.userNull.statisticState = JSON.parse(
                    localStorage.appState
                ).userNull.statisticState;
            }
        }
    }
}

// games

export function keyboardEventsHandler(e: Event) {
    const gameContainer = document.querySelector(".game-popup");
    if (!isHTMLDivElement(gameContainer)) return;
    const nextButton = gameContainer.querySelector(".next-button");
    if (!isHTMLElement(nextButton)) return;
    if ((currentGame.game as AudioCall).currentSlide === undefined) return;
    const currentSlide = gameContainer.querySelector(
        `.audio-call>div:nth-child(${
            (currentGame.game as AudioCall).currentSlide + 1
        })`
    );
    if (!isHTMLDivElement(currentSlide)) return;
    const buttonsContainer = currentSlide.querySelector(".answers-container");
    if (!isHTMLDivElement(buttonsContainer)) return;
    const playButton = currentSlide.querySelector(".play-button");
    if (!isHTMLButtonElement(playButton)) return;
    const answerOne = buttonsContainer?.querySelector("button:nth-child(1)");
    const answerTwo = buttonsContainer?.querySelector("button:nth-child(2)");
    const answerThree = buttonsContainer?.querySelector("button:nth-child(3)");
    const answerFour = buttonsContainer?.querySelector("button:nth-child(4)");
    if (
        !isHTMLButtonElement(answerOne) ||
        !isHTMLButtonElement(answerTwo) ||
        !isHTMLButtonElement(answerThree) ||
        !isHTMLButtonElement(answerFour)
    )
        return;
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
        default:
            break;
    }
}

export function closeGameOnPressESC(e: Event) {
    const closeGameButton = document.querySelector(".game-popup .close-button");
    if (!closeGameButton) return;
    if ((e as KeyboardEvent).keyCode === 27) {
        (closeGameButton as HTMLDivElement).click();
    }
}

export function moveGameSlider(
    sliderContainer: HTMLElement,
    nextButton: HTMLElement
) {
    const innerSliderContainer = sliderContainer;
    if (
        Number(innerSliderContainer.style.left.split("%")[0]) !==
        -Number(innerSliderContainer.style.width.split("%")[0]) + 100
    ) {
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
        document.removeEventListener("keydown", keyboardEventsHandler);
    }
}

export function playWordInGameHandler(audio: HTMLAudioElement) {
    audio.play();
}

function stopPlayingWordHandler(audio: HTMLAudioElement) {
    audio.pause();
}

export async function modifyWord(
    game: AudioCall | Sprint,
    word: IAggreagtedWord,
    gameName: string
) {
    const body: IUserWord = getUserWord(word);
    let nameForLS;
    if(gameName === 'audiocall') {
        nameForLS = 'audioCall'
    } else {
        nameForLS = 'sprint'
    }

    if (!body) return;

    body.optional[gameName as keyof typeof body.optional].countGames += 1;
    if (game.state.answers.true.find((id) => id === word.id)) {
        body.optional[gameName as keyof typeof body.optional].rightAnswer += 1;
        body.optional[
            gameName as keyof typeof body.optional
        ].rightAnswerSeries += 1;
        if (body.difficulty === "hard") {
            if (
                body.optional[gameName as keyof typeof body.optional]
                    .rightAnswerSeries >= 5
            ) {
                body.difficulty = "easy";
                const state = (appState.user.statsToday as IUserStats).statisticState;
                state[nameForLS as keyof typeof state].wordsLearnt += 1;
            }
        }
        if (body.difficulty === "norm") {
            if (
                body.optional[gameName as keyof typeof body.optional]
                    .rightAnswerSeries >= 3
            ) {
                body.difficulty = "easy";
                const state = (appState.user.statsToday as IUserStats).statisticState;
                state[nameForLS as keyof typeof state].wordsLearnt += 1;
            }
        }
    } else if (game.state.answers.false.find((id) => id === word.id)) {
        body.optional[
            gameName as keyof typeof body.optional
        ].rightAnswerSeries = 0;
        body.difficulty = "hard";
    } else {
        return;
    }
    await fetchPostOrPutUserWord({
        word,
        modifyedUserWord: body,
    });
}

// eslint-disable-next-line func-names
export const pressKey = function (event: KeyboardEvent) {
    const arrayLeftKey = document.querySelector(".right-key");
    if (!isHTMLButtonElement(arrayLeftKey)) return;
    const arrayRightKey = document.querySelector(".wrong-key");
    if (!isHTMLButtonElement(arrayRightKey)) return;
    window.addEventListener("keydown", (e) => {
        if (e.code === "ArrowLeft") {
            arrayLeftKey.classList.add("active");
        }
        if (e.code === "ArrowRight") {
            arrayRightKey.classList.add("active");
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.code === "ArrowLeft") {
            arrayLeftKey.classList.remove("active");
        }
        if (e.code === "ArrowRight") {
            arrayRightKey.classList.remove("active");
        }
    });

    event.preventDefault();
    if (event.code === "ArrowLeft") {
        (currentGame.game as Sprint).onRightButton();
    } else if (event.code === "ArrowRight") {
        (currentGame.game as Sprint).onWrongButton();
    }
};

export function startGame(
    container: HTMLElement,
    section: number,
    game: string,
    page: number,
    arrOfWords?: IResWordsPage
) {
    let popup: HTMLElement;
    if (!arrOfWords) {
        popup = new GamePopUp().create(section, page, game);
    } else {
        popup = new GamePopUp().create(section, page, game, arrOfWords);
    }
    container.append(popup);
    document.addEventListener("keydown", closeGameOnPressESC);
    document.addEventListener("keydown", keyboardEventsHandler);
    const closeButton = container.querySelector(".close-button");
    if (!isHTMLElement(closeButton)) return;
    if (game === SPRINT) {
        document.addEventListener("keydown", pressKey, false);
        const timer = setTimeout(() => {
            (currentGame.game as Sprint).endGame();
            document.removeEventListener("keydown", pressKey);
        }, 61000);
        closeButton.addEventListener("click", () => {
            clearTimeout(timer);
        });
    }
    closeButton.addEventListener("click", async () => {
        if (!appState.isSignedIn) {
            setStats(currentGame.game as AudioCall | Sprint, appState.userNull);
        } else {
            setStats(
                currentGame.game as AudioCall | Sprint,
                appState.user.statsToday as IUserStats
            );
        }
        if (currentGame.game === SPRINT) {
            ((currentGame.game as unknown) as Sprint).endGame();
        }
        currentGame.game = null;
        container.removeChild(popup);
        const overlay = document.querySelector(".overlay");
        overlay?.classList.add("hidden");
        if (appState.view === "textbook") {
            getActiveViewData();
        }
    });
    const nextButton = container.querySelector(".next-button");
    if (!isHTMLElement(nextButton)) return;
    if (game === SPRINT) {
        nextButton.classList.add("hidden");
    }
    nextButton.addEventListener("click", () => {
        nextButton.blur();
        if (currentGame.game instanceof AudioCall) {
            const sliderContainer = popup.querySelector(".audio-call");
            if (!isHTMLDivElement(sliderContainer)) return;
            (currentGame.game as AudioCall).currentSlide += 1;
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
        }
    });
    const overlay = document.querySelector(".overlay");
    overlay?.classList.remove("hidden");
}

export function startGameHandler(e: Event, arrOfWords?: IResWordsPage): void {
    const {target} = e;
    const gameContainer = document.querySelector(".games-wrapper");
    if (!isHTMLElement(gameContainer)) return;
    if (!isHTMLButtonElement(target)) return;
    if (!target.classList.contains("start-button")) return;
    target.blur();
    let page;
    let section;
    if (target.classList.contains("sprint-button")) {
        if (!arrOfWords) {
            section = Number(
                target.closest(".game-container")?.querySelector("select")
                    ?.value
            );
            page = getRandomInRange(TEXTBOOK_PAGE_COUNT);

            startGame(gameContainer, section, SPRINT, page);
        } else {
            page = appState.viewsStates.textbook.page;
            section = appState.viewsStates.textbook.group;
            startGame(gameContainer, section, SPRINT, page, arrOfWords);
        }
    } else if (!arrOfWords) {
        page = getRandomInRange(TEXTBOOK_PAGE_COUNT);
        section = Number(
            target.closest(".game-container")?.querySelector("select")?.value
        );
        startGame(gameContainer, section, AUDIO_CALL, page);
    } else {
        page = appState.viewsStates.textbook.page;
        section = appState.viewsStates.textbook.group;
        startGame(gameContainer, section, AUDIO_CALL, page, arrOfWords);
    }
}

export function playAgainHandler(gameContainer: HTMLElement, section: number) {
    if (!appState.isSignedIn) {
        setStats(currentGame.game as AudioCall | Sprint, appState.userNull);
    } else {
        setStats(
            currentGame.game as AudioCall | Sprint,
            appState.user.statsToday as IUserStats
        );
    }
    currentGame.game = null;
    const PAGE = getRandomInRange(TEXTBOOK_PAGE_COUNT);
    const container = document.querySelector(".games-wrapper");
    if (!isHTMLElement(container)) return;
    container.removeChild(gameContainer);
    startGame(container, section, AUDIO_CALL, PAGE);
}

export function goToStatisticPageHandler() {
    currentGame.game = null;
    document.querySelector(".games-wrapper")?.replaceChildren();
    appState.view = "stats";
    getActiveViewData();
}

export function getGameWordsArr(arr: WordsData) {
    const output: IAggreagtedWord[] = [];
    if (arr.length >= 10) {
        while (output.length < 10) {
            const ind = getRandomInRange(arr.length);
            if (!output.includes(arr[ind])) output.push(arr[ind]);
        }
    } else {
        while (output.length < arr.length) {
            const ind = getRandomInRange(arr.length);
            if (!output.includes(arr[ind])) output.push(arr[ind]);
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
    const currentWord: IAggreagtedWord | undefined = (currentGame.game as AudioCall).wordsInGame?.find(word=>word.id === wordId);
    if (appState.isSignedIn) {
        if (currentGame.game instanceof AudioCall) {
            modifyWord((currentGame.game as AudioCall), (currentWord as IAggreagtedWord), 'audiocall')
        }
    }
    (currentGame.game as AudioCall).currentWord = currentWord;
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
    if (target.classList.contains("yes-button")) {
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
    if (appState.viewsStates.textbook.mode === "textbook" || (!appState.isSignedIn)) {
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
