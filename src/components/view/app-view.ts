import {textbookState} from "../controller/state";
import {TextbookView} from "./textbook/textbook-view";
import {createElementWithAttributes} from "./utils";
import { isHTMLElement } from "../../typings/utils/utils";
import { Form } from "./login-form/login-form";
import { ShowFormPanel } from "./login-form/show-button";
// import { appState } from "../controller/state";


export class AppView {
    private textbook = new TextbookView(textbookState);
    private form = new Form();
    private showForm = new ShowFormPanel();

    private drawTestView(): void {
        const root = createElementWithAttributes("div", {id: "root"});
        root.append(this.textbook.template);
        document.body.append(root);
    }

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
      this.drawTestView();
      this.drawForm();
  }
}

