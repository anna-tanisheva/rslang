import { AppView } from '../view/app-view';


export class App {
  private view = new AppView();

  public start(): void {
    this.view.drawView();
  }
}