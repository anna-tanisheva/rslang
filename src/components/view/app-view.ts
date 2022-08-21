import {createElementWithAttributes} from "./utils";
import {isHTMLElement} from "../../typings/utils/utils";
import {Form} from "./login-form/login-form";
import {ShowFormPanel} from "./login-form/show-button";
import {HeaderView} from "./header/header-view";
import {MainView} from "./main/main-view";
import {FooterView} from "./footer/footer-view";
import { currentView } from "../controller/state";

export class AppView {
    private headerView = new HeaderView().create();

    private mainView = new MainView(currentView.view).create();

    private footerView = new FooterView().create();

    private form = new Form().create();

    private showForm = new ShowFormPanel().create();

    private drawForm(): void {
        const headerWrapper = document.querySelector(".header-wrapper");
        if (!isHTMLElement(headerWrapper)) return;
        headerWrapper.append(this.showForm);
    }

    public drawView(): void {
        const root = createElementWithAttributes("div", {id: "root"});
        root.append(this.headerView, this.mainView, this.footerView, this.form);
        document.body.append(root);
        this.drawForm();
    }

    public redrawView(view: string): void {
      const root = document.querySelector('.main');
      if (!isHTMLElement(root)) return;
      console.log(this.mainView)
      this.mainView = new MainView(view).create();
      root.replaceChildren();
      root.append(this.mainView)
    }
}
