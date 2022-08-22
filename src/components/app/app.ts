import { AppView } from '../view/app-view';
import { isHTMLDivElement, isHTMLButtonElement, isHTMLElement } from "../../typings/utils/utils";
import { showForms, addNewUserHandler, signInHandler, logOutHandler, setCurrentUserOnLoad, showFormHandler } from '../controller/ui';
import { getRouteHandler } from '../controller/routing';

export class App {
  private view = new AppView();

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
    const showForm = document.querySelector('.show-form');
    if(!isHTMLButtonElement(showForm)) return;
    const navigation = document.querySelector('.nav');
    if(!isHTMLElement(navigation)) return;

    window.addEventListener('load', setCurrentUserOnLoad);

    tabFormButtons.addEventListener('click', showForms);
    submitRegistrationBtn.addEventListener('click', addNewUserHandler);
    submitLogInBtn.addEventListener('click', signInHandler);
    submitLogOutBtn.addEventListener('click', logOutHandler);
    showForm.addEventListener('click', showFormHandler);

    // routing
    navigation.addEventListener('click', getRouteHandler);
    navigation.addEventListener('click', (e: Event) => {
      const {target} = e;
      if(!isHTMLElement(target)) return;
      if (!target.classList.contains('nav-link')) return;
      const link = target.getAttribute('href');
      if(!link) return;
      this.view.redrawView(link);
    });
    // change view on popstate event
    window.addEventListener('popstate', () => {
      this.view.redrawView(window.history.state.view);
     })
  }
}