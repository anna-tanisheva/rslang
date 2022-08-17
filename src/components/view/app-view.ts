import { isHTMLElement } from "../../typings/utils/utils";

export class AppView {

  private drawTestView(): void {
    const body = document.querySelector('body');
    const hello = document.createElement('h1');
    hello.innerText = 'Hello World!';
    if (!isHTMLElement(body)) return;
    body.append(hello);
  }

    public drawView(): void {
      this.drawTestView();
  }
}