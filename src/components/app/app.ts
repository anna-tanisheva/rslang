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
} from "../controller/ui";
import {getRouteHandler} from "../controller/routing";
import {appState} from "../controller/state";

export class App {
    private view = new AppView();

    public start(): void {
        getLocalStorage();
        this.view.drawView();
        this.addEventListeners();
        this.view.redrawView(appState.view);
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
        const navigation = document.querySelector(".nav");
        if (!isHTMLElement(navigation)) return;

        window.addEventListener("DOMContentLoaded", () => {
            setCurrentUserOnLoad();
            getLocalStorage();
        });

        tabFormButtons.addEventListener("click", showForms);
        submitRegistrationBtn.addEventListener("click", addNewUserHandler);
        submitLogInBtn.addEventListener("click", signInHandler);
        submitLogOutBtn.addEventListener("click", logOutHandler);
        showForm.addEventListener("click", showFormHandler);

        // routing
        navigation.addEventListener("click", getRouteHandler);
        navigation.addEventListener("click", (e: Event) => {
            const {target} = e;
            if (!isHTMLElement(target)) return;
            if (!target.classList.contains("nav-link")) return;
            const link = target.getAttribute("href");
            if (!link) return;
            this.view.redrawView(link);
        });
        // change view on popstate event
        window.addEventListener("popstate", () => {
            this.view.redrawView(window.history.state.view);
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
        });
        // Обновление локалсторэдж перед выгрузкой страницы (закрытие/обновление)
        window.addEventListener("beforeunload", () => {
            setLocalStorage();
        });
    }
}