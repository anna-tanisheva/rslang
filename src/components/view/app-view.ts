import { isHTMLElement } from "../../typings/utils/utils";
import { Form } from "./login-form/login-form";

export class AppView {

  private form = new Form();

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
    formContainer.classList.add('form-container');
    formContainer.innerHTML = this.form.template
    body.append(formContainer);
  }

    public drawView(): void {
      this.drawTestView();
      this.drawForm();
  }
}