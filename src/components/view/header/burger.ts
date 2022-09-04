import { isHTMLElement } from "../../../typings/utils/utils";

export function toggleMenu(e: Event): void {
    if (!isHTMLElement(e.target)) return;
    const navMenu = document.getElementById("nav-list");
    if (!isHTMLElement(navMenu)) return;
    const menu = document.getElementById("hamburger");
    if (!isHTMLElement(menu)) return;

    navMenu.classList.toggle("_active");
    menu.classList.toggle("_active");
}

