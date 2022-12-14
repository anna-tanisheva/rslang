import { AppView } from '../view/app-view';
import { isHTMLDivElement, isHTMLButtonElement, isHTMLElement } from "../../typings/utils/utils";
import {
    showForms,
    addNewUserHandler,
    signInHandler,
    logOutHandler,
    setCurrentUserOnLoad,
    showFormHandler,
    getLocalStorage,
    setLocalStorage,
    getActiveViewData,
} from "../controller/ui";
import {getRouteHandler} from "../controller/routing";
import {appState, currentGame} from "../controller/state";
import { toggleMenu } from '../view/header/burger';

export class App {
    private view = new AppView();

    public start(): void {
        getLocalStorage();
        this.view.drawView();
        getActiveViewData();
        this.addEventListeners();
    }

    public addEventListeners() {
        const tabFormButtons = document.querySelector(".show-form-wrapper");
        if (!isHTMLDivElement(tabFormButtons)) return;
        const submitRegistrationBtn = document.querySelector(
            ".registration-submit"
        );
        if (!isHTMLButtonElement(submitRegistrationBtn)) return;
        const submitLogInBtn = document.querySelector(".login-submit");
        if (!isHTMLButtonElement(submitLogInBtn)) return;
        const submitLogOutBtn = document.querySelector(".logout-submit");
        if (!isHTMLButtonElement(submitLogOutBtn)) return;
        const showForm = document.querySelector(".show-form");
        if (!isHTMLButtonElement(showForm)) return;
        const closeFormButton = document.querySelector(".close-form-button");
        if (!isHTMLButtonElement(closeFormButton)) return;
        const navigation = document.querySelector(".nav");
        if (!isHTMLElement(navigation)) return;
        const logo = document.querySelector(".logo-link");
        if (!isHTMLElement(logo)) return;
        const burger = document.querySelector(".nav");
        if (!isHTMLElement(burger)) return;
        
        window.addEventListener("DOMContentLoaded", () => {
            setCurrentUserOnLoad();
        });

        tabFormButtons.addEventListener("click", showForms);
        submitRegistrationBtn.addEventListener("click", addNewUserHandler);
        submitLogInBtn.addEventListener("click", signInHandler);
        submitLogOutBtn.addEventListener("click", logOutHandler);
        [showForm, closeFormButton].forEach((elem) =>
            elem.addEventListener("click", showFormHandler)
        );        
        burger.addEventListener("click", toggleMenu);

        // routing
        navigation.addEventListener("click", getRouteHandler);
        navigation.addEventListener("click", (e: Event) => {
            const {target} = e;
            if (!isHTMLElement(target)) return;
            if (!target.classList.contains("nav-link")) return;
            const link = target.getAttribute("href");
            if (!link) return;
            currentGame.game = null;
            document.querySelector(".games-wrapper")?.replaceChildren();
            getActiveViewData();
        });
        logo.addEventListener("click", getRouteHandler);
        logo.addEventListener("click", (e: Event) => {
            const {target} = e;
            if (!isHTMLElement(target)) return;
            if (!target.classList.contains("logo-link")) return;
            const link = target.getAttribute("href");
            if (!link) return;
            currentGame.game = null;
            document.querySelector(".games-wrapper")?.replaceChildren();
            getActiveViewData();
        });
        // change view on popstate event
        window.addEventListener("popstate", () => {
            const array = window.location.href.split("/");
            const lastword = array[array.length - 1];
            if (!array.includes(appState.view)) {
                if (
                    lastword === "index" ||
                    lastword === "games" ||
                    lastword === "textbook" ||
                    lastword === "stats"
                ) {
                    appState.view = lastword;
                    setLocalStorage();
                }
            }
            getActiveViewData();
        });
        // ???????????????????? ???????????????????????? ?????????? ?????????????????? ???????????????? (????????????????/????????????????????)
        window.addEventListener("beforeunload", () => {
            setLocalStorage();
        });
    }
}