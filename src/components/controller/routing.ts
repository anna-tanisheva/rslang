// import Route from "route-parser";
import { isHTMLElement } from "../../typings/utils/utils";
import { currentView } from "./state";
// import { ENDPOINT } from "./state";

export function setURL() {
  window.history.pushState(currentView, "page 1", currentView.view);
}

export function getRouteHandler(e: Event) {
  const {target} = e;
  if(!isHTMLElement(target)) return;
  if (!target.classList.contains('nav-link')) return;
  const link = target.getAttribute('href');
  console.log(link)
  e.preventDefault();
  if(!link) return;
  currentView.view = link;
  setURL();
}


