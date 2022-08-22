import {isHTMLElement} from "../../typings/utils/utils";
import {appState} from "./state";
import {setLocalStorage} from "./ui";

export function setURL() {
    window.history.pushState(appState, "page 1", appState.view);
}

export function getRouteHandler(e: Event) {
    const {target} = e;
    if (!isHTMLElement(target)) return;
    if (!target.classList.contains("nav-link")) return;
    const link = target.getAttribute("href");
    e.preventDefault();
    if (!link) return;
    appState.view = link;
    setLocalStorage();
    setURL();
}
