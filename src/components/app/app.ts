import { AppView } from '../view/app-view';
import { isHTMLDivElement, isHTMLButtonElement } from "../../typings/utils/utils";
import { showForms, addNewUserHandler, signInHandler, logOutHandler, setCurrentUserOnLoad } from '../controller/ui';


export class App {
  private view = new AppView();

  private storage = localStorage;

  public start(): void {
    this.view.drawView();

    const tabFormButtons = document.querySelector('.show-form-wrapper');
    if(!isHTMLDivElement(tabFormButtons)) return;
    const submitRegistrationBtn = document.querySelector('.registration-submit');
    if(!isHTMLButtonElement(submitRegistrationBtn)) return;
    const submitLogInBtn = document.querySelector('.login-submit');
    if(!isHTMLButtonElement(submitLogInBtn)) return;
    const submitLogOutBtn = document.querySelector('.logout-submit');
    if(!isHTMLButtonElement(submitLogOutBtn)) return;

    window.addEventListener('load', setCurrentUserOnLoad)

    tabFormButtons.addEventListener('click', showForms);
    submitRegistrationBtn.addEventListener('click', addNewUserHandler);
    submitLogInBtn.addEventListener('click', signInHandler);
    submitLogOutBtn.addEventListener('click', logOutHandler);
  }
}