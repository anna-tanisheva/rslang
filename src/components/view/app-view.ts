import {textbookState} from "../controller/state";
import {TextbookView} from "./textbook/textbook-view";
import {createElementWithAttributes} from "./utils";
import { isHTMLElement } from "../../typings/utils/utils";
import { Form } from "./login-form/login-form";
import { ShowFormPanel } from "./login-form/show-button";
import { Header } from "./page-view/header-view";
import { MainPage } from "./page-view/main-view";
import { Footer } from "./page-view/footer-view";
// import { appState } from "../controller/state";


export class AppView {
  private header = new Header().create();

  private footer = new Footer().create();
  
  private main = new MainPage().create();

    private textbook = new TextbookView(textbookState);

    private form = new Form();

    private showForm = new ShowFormPanel();

  private drawForm(): void {
    const body = document.querySelector('body');
    if(!isHTMLElement(body)) return;
    const formContainer = document.createElement('div');
    const showFormContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    formContainer.classList.add('hidden');
    formContainer.innerHTML = this.form.template
    showFormContainer.classList.add('show-form-container');
    showFormContainer.innerHTML = this.showForm.template;

    body.append(formContainer);
    body.append(showFormContainer);
  }

    public drawView(): void {
      const root = createElementWithAttributes("div", {id: "root"});
      root.append(this.textbook.template, this.header, this.main, this.footer);
      document.body.append(root);
      this.drawForm();
  }

}

