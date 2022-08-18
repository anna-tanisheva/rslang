import { isHTMLElement } from "../../typings/utils/utils";
import { Form } from "./login-form/login-form";
import { ShowFormPanel } from "./login-form/show-button";
// import { appState } from "../controller/state";

export class AppView {

  private form = new Form();

  private showForm = new ShowFormPanel();

  private drawTestView(): void {
    const body = document.querySelector('body');
    const hello = document.createElement('h1');
    hello.innerText = 'Hello World!';
    if (!isHTMLElement(body)) return;
    body.append(hello);
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