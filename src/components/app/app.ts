import { AppView } from '../view/app-view';
import { isHTMLDivElement } from "../../typings/utils/utils";
import { showForms } from '../controller/ui';


export class App {
  private view = new AppView();

  private storage = localStorage;

  public start(): void {
    this.view.drawView();

    const tabFormButtons = document.querySelector('.show-form-wrapper');
    if(!isHTMLDivElement(tabFormButtons)) return;
    tabFormButtons.addEventListener('click', showForms);
  }
}