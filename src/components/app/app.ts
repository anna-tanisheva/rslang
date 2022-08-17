import { AppView } from '../view/app-view';


export class App {
  private view = new AppView();

  private storage = localStorage;

  public start(): void {
    this.view.drawView();
    console.log(this.storage);
  }
}