import { isHTMLButtonElement, isHTMLElement } from "../../typings/utils/utils";

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